#!/bin/bash
echo "Запуск бэкенда..."
cd backend && npm run dev &
cd .. && npm run dev &
wait
