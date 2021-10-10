module.exports = {
    preset: "ts-jest",
    testEnvironment: 'jsdom',
    "transform": {
        "^.+\\.svelte$": [
            "svelte-jester",
            {
                "preprocess": true
            }
        ],
        "^.+\\.ts$": "ts-jest"
    },
    "moduleFileExtensions": [
        "js",
        "ts",
        "svelte"
    ],
    moduleDirectories: ['node_modules', 'src', 'test'],
    moduleNameMapper: {
        "obsidian": "mocks/obsidian.ts"
    },
    transformIgnorePatterns: ["node_modules"],
    testPathIgnorePatterns: ["node_modules"],
}