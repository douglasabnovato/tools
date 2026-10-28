<#
  verificar.ps1 — verificações estáticas do site "tools" (sem dependência, sem build).
  Uso (na raiz do projeto):   powershell -ExecutionPolicy Bypass -File docs/claudeia/verificar.ps1
  Também roda no CI (pwsh no ubuntu-latest). Sai com código 1 se houver ERRO; AVISO não falha.
  Compatível com Windows PowerShell 5.1 e PowerShell 7+.
#>
$ErrorActionPreference = 'Stop'
$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location $raiz

$script:erros = 0
$script:avisos = 0
function Ok($msg)    { Write-Host "  [OK]    $msg" -ForegroundColor Green }
function Erro($msg)  { Write-Host "  [ERRO]  $msg" -ForegroundColor Red; $script:erros++ }
function Aviso($msg) { Write-Host "  [AVISO] $msg" -ForegroundColor Yellow; $script:avisos++ }
function Ler($p)     { [System.IO.File]::ReadAllText((Join-Path $raiz $p), [System.Text.Encoding]::UTF8) }
function Existe($p)  { Test-Path -LiteralPath (Join-Path $raiz ($p -replace '^\./', '')) }

Write-Host "`n1. Arquivos locais referenciados no index.html"
$html = Ler 'index.html'
$refs = [regex]::Matches($html, '(?:src|href)="(\./[^"#?]*)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($r in $refs) {
  if ($r -eq './') { continue }
  if (Existe $r) { Ok $r } else { Erro "index.html aponta para $r, que não existe" }
}
if ($html -match '<html[^>]*\blang="pt-BR"') { Ok 'lang="pt-BR" presente' } else { Erro 'index.html sem lang="pt-BR"' }
if ($html -match '<meta\s+name="description"') { Ok 'meta description presente' } else { Erro 'index.html sem meta description' }
foreach ($id in 'catalogo','modelo-card','busca','limpar-busca','filtros','contador','ver-mais','fim-da-lista','rotulo-secao','titulo-secao','subtitulo-secao','conteudo','cabecalho','alternar-tema','ano','aba-tools','aba-host') {
  if ($html -notmatch "id=`"$id`"") { Erro "id `"$id`" usado por js/renderer.js não existe no index.html" }
}
Ok 'ids usados pelo renderer conferidos'

Write-Host "`n2. Imports entre módulos JS"
foreach ($js in @('main.js') + (Get-ChildItem js -Filter *.js | ForEach-Object { "js/$($_.Name)" })) {
  $base = Split-Path $js -Parent
  foreach ($m in [regex]::Matches((Ler $js), 'from\s+"(\.[^"]+)"')) {
    $alvo = if ($base) { Join-Path $base $m.Groups[1].Value } else { $m.Groups[1].Value }
    if (Test-Path -LiteralPath (Join-Path $raiz $alvo)) { Ok "$js -> $($m.Groups[1].Value)" } else { Erro "$js importa $($m.Groups[1].Value), que não existe" }
  }
}

Write-Host "`n3. Dados do catálogo (data/tools.js e data/host.js)"
$total = @{}
foreach ($arq in 'data/tools.js','data/host.js') {
  $txt = Ler $arq
  $titulos = @([regex]::Matches($txt, 'title:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
  $campos = @{}
  foreach ($c in 'description','category','pricing','thumb','site_url') {
    $campos[$c] = @([regex]::Matches($txt, "${c}:\s*`"([^`"]+)`"") | ForEach-Object { $_.Groups[1].Value })
  }
  $n = $titulos.Count
  $total[$arq] = $n
  foreach ($c in $campos.Keys) {
    if ($campos[$c].Count -ne $n) { Erro "$arq tem $n títulos mas $($campos[$c].Count) campos '$c'" }
  }
  Ok "$arq com $n itens"
  $dup = $titulos | Group-Object | Where-Object Count -gt 1
  foreach ($d in $dup) { Erro "$arq tem título duplicado: $($d.Name)" }
  foreach ($u in $campos['site_url']) { if ($u -notmatch '^https://') { Erro "$arq site_url sem https: $u" } }
  foreach ($p in $campos['pricing']) { if ($p -notin 'Gratuito','Freemium','Pago') { Erro "$arq pricing fora do padrão: $p" } }
  foreach ($t in $campos['thumb']) {
    if ($t -match '^https?://') { Aviso "$arq usa miniatura externa: $t" }
    elseif (-not (Existe $t)) { Erro "$arq aponta miniatura inexistente: $t" }
  }
}

Write-Host "`n4. Manifest (public/site.webmanifest é JSON válido e os ícones existem)"
try {
  $man = (Ler 'public/site.webmanifest') | ConvertFrom-Json
  Ok 'site.webmanifest é JSON válido'
  foreach ($i in $man.icons) {
    if (Test-Path -LiteralPath (Join-Path $raiz ("public/" + ($i.src -replace '^\./', '')))) { Ok "ícone $($i.src)" } else { Erro "ícone do manifest não existe: $($i.src)" }
  }
} catch { Erro "site.webmanifest inválido: $($_.Exception.Message)" }

Write-Host "`n5. Coerência e higiene (avisos)"
$readme = Ler 'Readme.md'
if ($readme -match '(\d+) ferramentas · (\d+) hospedagens') {
  if ([int]$Matches[1] -ne $total['data/tools.js'] -or [int]$Matches[2] -ne $total['data/host.js']) {
    Aviso "Readme diz $($Matches[1]) ferramentas / $($Matches[2]) hospedagens; dados têm $($total['data/tools.js']) / $($total['data/host.js'])"
  } else { Ok 'contagem do Readme bate com os dados' }
}
if ((Ler 'js/config.js') -match 'SEU-SUBDOMINIO') { Aviso 'js/config.js ainda tem o placeholder SEU-SUBDOMINIO: API e script de identificação ficam desligados' }
$usado = (Ler 'index.html') + (Ler 'data/tools.js') + (Ler 'data/host.js')
Get-ChildItem assets -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($raiz.Length + 1) -replace '\\', '/'
  if ($usado -notmatch [regex]::Escape($rel)) { Aviso ("arquivo não referenciado: {0} ({1:N0} KB)" -f $rel, ($_.Length / 1KB)) }
}
$grandes = Get-ChildItem assets -Recurse -File | Where-Object Length -gt 300KB
foreach ($g in $grandes) { Aviso ("imagem acima de 300 KB: {0} ({1:N0} KB)" -f $g.Name, ($g.Length / 1KB)) }

Write-Host ""
Write-Host "Resultado: $script:erros erro(s), $script:avisos aviso(s)."
if ($script:erros -gt 0) { exit 1 } else { exit 0 }
