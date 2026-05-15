#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ROOT = 'C:\\DEMO\\aktobe-sweets'

const server = new McpServer({
  name: 'aktobe-sweets',
  version: '1.0.0',
})

// ── Файлы ──────────────────────────────────────────────

server.tool(
  'read_file',
  'Прочитать файл проекта',
  { path: z.string().describe('Относительный путь от корня проекта, например src/pages/home/HomePage.jsx') },
  async ({ path: p }) => {
    try {
      const content = fs.readFileSync(path.join(ROOT, p), 'utf-8')
      return { content: [{ type: 'text', text: content }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'write_file',
  'Записать содержимое в файл проекта',
  {
    path: z.string().describe('Относительный путь от корня проекта'),
    content: z.string().describe('Содержимое файла'),
  },
  async ({ path: p, content }) => {
    try {
      const fullPath = path.join(ROOT, p)
      fs.mkdirSync(path.dirname(fullPath), { recursive: true })
      fs.writeFileSync(fullPath, content, 'utf-8')
      return { content: [{ type: 'text', text: `✓ Записано: ${p}` }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'list_files',
  'Показать дерево файлов проекта',
  { dir: z.string().optional().default('src').describe('Директория для просмотра') },
  async ({ dir }) => {
    try {
      const list = []
      const walk = (d, indent = '') => {
        const entries = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })
        for (const entry of entries) {
          const rel = path.join(d, entry.name)
          if (entry.isDirectory()) {
            list.push(`${indent}📁 ${entry.name}/`)
            walk(rel, indent + '  ')
          } else {
            list.push(`${indent}📄 ${entry.name}`)
          }
        }
      }
      walk(dir)
      return { content: [{ type: 'text', text: list.join('\n') }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

// ── Сборка ─────────────────────────────────────────────

server.tool(
  'build',
  'Запустить vite build и вернуть результат',
  {},
  async () => {
    try {
      const out = execSync('npm run build', { cwd: ROOT, encoding: 'utf-8', timeout: 60000 })
      return { content: [{ type: 'text', text: `✓ Сборка успешна:\n${out}` }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `❌ Ошибка сборки:\n${e.stdout}\n${e.stderr}` }], isError: true }
    }
  }
)

// ── Git ────────────────────────────────────────────────

server.tool(
  'git_status',
  'Показать текущий статус git и последние коммиты',
  {},
  async () => {
    try {
      const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf-8' })
      const log = execSync('git log --oneline -5', { cwd: ROOT, encoding: 'utf-8' })
      const text = `📋 Изменения:\n${status || '(нет изменений)'}\n\n📜 Последние коммиты:\n${log}`
      return { content: [{ type: 'text', text: text }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'git_push',
  'Закоммитить все изменения и запушить на GitHub',
  { message: z.string().describe('Сообщение коммита') },
  async ({ message }) => {
    try {
      execSync('git add -A', { cwd: ROOT, encoding: 'utf-8' })
      execSync(`git commit -m "${message.replace(/"/g, "'")}"`, { cwd: ROOT, encoding: 'utf-8' })
      execSync('git push origin main', { cwd: ROOT, encoding: 'utf-8' })
      return { content: [{ type: 'text', text: `✓ Запушено: ${message}` }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

// ── Данные проекта ─────────────────────────────────────

server.tool(
  'get_products',
  'Получить все товары из mockData',
  {},
  async () => {
    try {
      const content = fs.readFileSync(path.join(ROOT, 'src/constants/mockData.js'), 'utf-8')
      return { content: [{ type: 'text', text: content }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'get_pages',
  'Список всех страниц проекта',
  {},
  async () => {
    try {
      const pagesDir = path.join(ROOT, 'src/pages')
      const pages = []
      for (const dir of fs.readdirSync(pagesDir)) {
        const files = fs.readdirSync(path.join(pagesDir, dir))
        files.forEach(f => pages.push(`src/pages/${dir}/${f}`))
      }
      return { content: [{ type: 'text', text: pages.join('\n') }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'get_store',
  'Прочитать Zustand-стор по имени (useOrdersStore, useCartStore, useAuthStore)',
  { name: z.string().describe('Имя стора, например useOrdersStore') },
  async ({ name }) => {
    try {
      const storePath = path.join(ROOT, `src/store/${name}.js`)
      const content = fs.readFileSync(storePath, 'utf-8')
      return { content: [{ type: 'text', text: content }] }
    } catch (e) {
      return { content: [{ type: 'text', text: `Ошибка: ${e.message}` }], isError: true }
    }
  }
)

server.tool(
  'project_info',
  'Общая информация о проекте: стек, страницы, сторы',
  {},
  async () => {
    const info = `
# Актобе Свитс — Информация о проекте

## Стек
- React 19 + Vite 8
- Tailwind CSS v4
- Zustand v5 (стейт)
- React Router v7
- Framer Motion (анимации)
- Задеплоен на Vercel

## Роли пользователей
- user (покупатель) — user@demo.kz / 123456
- venue (кондитерская) — venue@demo.kz / 123456
- admin — admin@demo.kz / 123456

## Страницы
- / — Главная
- /catalog — Каталог товаров
- /product/:id — Карточка товара
- /constructor — Конструктор торта (тендер)
- /cart — Корзина
- /checkout — Оформление заказа
- /orders — Мои заказы (с тендерными ставками)
- /profile — Профиль
- /venue — Панель кондитерской (тендеры, каталог, сообщения)
- /admin — Админ-панель
- /login, /register — Авторизация

## Ключевые сторы
- useOrdersStore — заказы, тендеры, ставки (addOrder, addBid, acceptBid)
- useCartStore — корзина (addItem, removeItem, updateQuantity, clearCart)
- useAuthStore — авторизация (login, logout)

## Тендерная система
- Заказы из конструктора создаются как type:'tender', status:'bidding'
- Кондитерские видят тендеры и подают ставки (addBid)
- Покупатель принимает лучшую ставку (acceptBid)
`.trim()
    return { content: [{ type: 'text', text: info }] }
  }
)

// ── Запуск ─────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)
