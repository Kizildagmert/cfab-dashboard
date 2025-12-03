## Teknolojiler ve Araçlar

React + Vite
TypeScript
Zustand(state management)
React Hook form + zod (login)
Tailwindcss
Sonner (toast notifications)
lucide(icons)
React Router DOM
Mock API(backend)

## Kritik gereksinimler için:

Auth State (Login / Logout):

token ve rol bilgisi localStorage'a kaydedilir.
Kullanıcı logout yaptığında token ve rol bilgisi clear edilir.


## Role göre yetkilendirme:

Role göre conditional bir durum söz konusudur.
Eğer kullanıcı "admin" ise sisteme kullanıcı ekleyebilir.
Eğer kullanıcı "user" rolüne sahipse kullanıcı ekle butonunu göremez.

## Filtreme:

Kullanıcı Ad Soyad E-posta Tc ile filtreleme yapabilir.
büyük küçük harf duyarsız
Debounce eklenmiştir.

Tckn 11 haneye duyarlıdır.(kullanıcı eklerken)

Meslek grubu dropdown seçimli

Filtre ve sort değiştiğinde sayfa direkt 1 e atar.

## Sayfalama, Liste:

page,size, total zustand içinde tutulur.
Tablo başlıklarına tıklayınca sort yapılabilir.(sort state değişir.)

## Yeni kullanıcı ekleme:

Sadece admin kullanıcılar kullanıcı ekleyebilir.

Ad Soyad Tc E-posta meslek rol ve durum eklenebilir.
Eklenen kullanıcı localStorage da saklanır. Buradaki amaç eklenen kullanıcı ile login yapabilmek ve f5 yapıldığında kullanıcının kaybolmaması (crudfab_users)

Mock Backend:

Backend simüle edilmeye çalışılmıştır.


PROJEYI CALISTIRMA:
```bash

npm install

npm run dev





