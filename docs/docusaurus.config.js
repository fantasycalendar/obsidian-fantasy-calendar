// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "My Site",
    tagline: "Dinosaurs are cool",
    url: "https://valentine195.github.io/",
    trailingSlash: false,
    baseUrl: "/obsidian-fantasy-calendar/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "valentine195", // Usually your GitHub org/user name.
    projectName: "obsidian-fantasy-calendar", // Usually your repo name.

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/valentine195/obsidian-fantasy-calendar"
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/valentine195/obsidian-fantasy-calendar"
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: "My Site",
                logo: {
                    alt: "My Site Logo",
                    src: "img/logo.svg"
                },
                items: [
                    {
                        type: "doc",
                        docId: "intro",
                        position: "left",
                        label: "Tutorial"
                    },
                    { to: "/blog", label: "Blog", position: "left" },
                    {
                        href: "https://github.com/facebook/docusaurus",
                        label: "GitHub",
                        position: "right"
                    }
                ]
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Tutorial",
                                to: "/docs/intro"
                            }
                        ]
                    },
                    {
                        title: "Community",
                        items: [
                            {
                                label: "Stack Overflow",
                                href: "https://stackoverflow.com/questions/tagged/docusaurus"
                            },
                            {
                                label: "Discord",
                                href: "https://discordapp.com/invite/docusaurus"
                            },
                            {
                                label: "Twitter",
                                href: "https://twitter.com/docusaurus"
                            }
                        ]
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "Blog",
                                to: "/blog"
                            },
                            {
                                label: "GitHub",
                                href: "https://github.com/facebook/docusaurus"
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
