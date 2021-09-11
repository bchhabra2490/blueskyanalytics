docker-compose up -d
npm i

cd data_migration 
node importData.js
cd ..
npm run dev
