import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach } from 'vitest'

beforeEach(async () => {
    if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
        localStorage.clear();
    }
    if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
        const databases = await indexedDB.databases();
        databases.forEach((db) => {
            if (db.name) indexedDB.deleteDatabase(db.name)
        })
    }
})

afterEach(() => {
    cleanup()
})
