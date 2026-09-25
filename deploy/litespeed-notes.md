# LiteSpeed Uyumluluk Notlari

## .htaccess calisiyor mu?

Evet. LiteSpeed, Apache `.htaccess` dosyasini dogrudan okur. Buyuk olcude ayni
dosyayi kullanabilirsiniz. Ancak birkac fark var:

## LiteSpeed icin farklar

### 1. Brotli modulu
Apache'de `mod_brotli` ayri bir modul olarak yuklenir. LiteSpeed'te Brotli
varsayilan olarak aciktir. `.htaccess`'teki `<IfModule mod_brotli.c>` blogu
LiteSpeed'te de calisir, ama modul kontrolune gerek yoktur. Brotli aktif mi
degil mi, `curl -I` ile test edin: `Content-Encoding: brotli` gorunmeli.

### 2. LiteSpeed Cache eklentisi
Eger host panelinde LiteSpeed Cache (LSCache) eklentisi aktifse, kendi cache
kurallarini `.htaccess` uzerine yazabilir. Ozellikle `Cache-Control` ve `Expires`
header'lari cakismasi riski vardir.

Cozum: LSCache panelinde "Cache Control" bolumunde `.htaccess` kurallarini
devre disi birakin veya "Do not cache" olarak ayarlayin. Yerine `.htaccess`'teki
kurali birakin.

### 3. Rewrite kurallari
`RewriteEngine On` ve `RewriteRule` kurallari ayni calisir. Farkli olan,
LiteSpeed'in `mod_rewrite` yerine kendi `ls_rewrite` motorunu kullanmasi.
Sonuc ayni: SPA fallback `index.html`'e yonlendirir.

### 4. `AddType` vs `AddOutputFilter`
`AddType` direktifleri LiteSpeed'te calisir. `AddOutputFilterByType` da calisir.
Ancak LiteSpeed'in kendi MIME type haritasi bazi uzantilari zaten tanir.
`AddType` komutlari yine de guvenli: cakismaz, sadece tanimlanmamis
uzantilari ekler.

### 5. `Header` direktifi
LiteSpeed'te `<IfModule mod_headers.c>` blogu calisir. Ancak LiteSpeed'in
kendi header yonetimi de var. Panel uzerinden eklenen header'lar
`.htaccess`'teki ile cakismaz, birlesir. Ayni header'i iki kez
tanimlamamaya dikkat edin.

## Kontrol listesi (LiteSpeed deploy oncesi)

1. `.htaccess` dosyasini yukleyin.
2. `curl -I https://domain.com/` ile header'lari kontrol edin.
3. `curl -I https://domain.com/sw.js` ile service worker cache
   kuralinin calistigini gorun: `Cache-Control: no-cache` olmali.
4. `curl -I https://domain.com/events` ile SPA fallback'in calistigini
   gorun: 200 donmeli, 404 degil.
5. Eger LSCache aktifse, panelde cache kurallarini `.htaccess` ile
   cakismayacak sekilde ayarlayin.
