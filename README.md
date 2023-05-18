# Hootka - Laravel inertiajs

Simple Kahoot Clone to play quiz in class built with laravel inertia echo and soketi  

## Support me

<!-- markdownlint-disable-next-line -->
<a href="https://trakteer.id/ajikamaludin" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-blue-2.png" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

## Requirements

- PHP 8.0 or latest
- Node 16+ or latest

## How to run

```bash
cp .env.example .env # configure app for laravel
touch database/database.sqlite # if you use .env.example with default sqlite database
composer install
npm install
npm run dev # compiling asset for development
```

## Default User

```text
username : admin@admin.com
password : password
```

## Compile Assets ( to prod )

```bash
npm run build
```

## Screenshot

![Dashboard1](1.png?raw=true)
![Dashboard2](2.png?raw=true)

## Rsync 

```bash 
rsync -arP -e 'ssh -p 224' --exclude=node_modules --exclude=.git --exclude=.env --exclude=storage --exclude=public/hot . arm@ajikamaludin.id:/home/arm/projects/hootka 
```
