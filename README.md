Website baca manga / komik sederhana, hanya memakai html, css dan javascript
Tempat penyimpanan data manga (cover, chapter) memakai cloudflare R2 dengan struktur berikut:
```
Manga translation
├── project1
│	   ├── manga1
│	   │	  └── manga.html
│	   ├── reader.html
│	   └── reader.js
├── index.html
├── style.css
└── sw.js

Cloudflare R2
├── Manga.json
├── admin.html
├── manga1
│	   ├── cover.png
│	   └── chapter53
│			  └── chapter img.jpg
└── manga2
	   ├── cover.png
	   └── chapter1
			  └── chapter img.jpg
```
Gallery dan Chapter akan berubah secara otomatis seiring bertambahnya konten baru.
Terdapat Admin panel Dan Cloudflare worker untuk mengupload chapter dan manga baru.
