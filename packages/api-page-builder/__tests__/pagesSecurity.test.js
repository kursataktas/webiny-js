import useGqlHandler from "./useGqlHandler";
import { identityA, identityB, NOT_AUTHORIZED_RESPONSE } from "./mocks";

function Mock(prefix) {
    this.slug = `${prefix}slug`;
    this.title = `${prefix}title`;
    this.description = `${prefix}description`;
    this.items = { [`${prefix}items`]: "items" };
}

const defaultHandler = useGqlHandler({
    permissions: [{ name: "content.i18n" }, { name: "pb.*" }],
    identity: identityA
});

describe("Pages Security Test", () => {
    const { deleteElasticSearchIndex, createCategory, until } = useGqlHandler();

    let initialPageIds, initialCategory;

    beforeEach(async () => {
        initialPageIds = [];
        await deleteElasticSearchIndex();

        await createCategory({
            data: {
                slug: `category`,
                name: `name`,
                url: `/some-url/`,
                layout: `layout`
            }
        }).then(([res]) => (initialCategory = res.data.pageBuilder.createCategory.data));
    });

    test(`"listPages" only returns entries to which the identity has access to`, async () => {
        const { createPage } = defaultHandler;
        await createPage({ category: initialCategory.slug });
        await createPage({ category: initialCategory.slug });

        const identityBHandler = useGqlHandler({ identity: identityB });
        await identityBHandler.createPage({ category: initialCategory.slug });
        await identityBHandler.createPage({ category: initialCategory.slug });

        const insufficientPermissions = [
            [[], null],
            [[], identityA],
            [[{ name: "pb.page", rwd: "wd" }], identityA],
            [[{ name: "pb.page", rwd: "d" }], identityA],
            [[{ name: "pb.page", rwd: "w" }], identityA],
            [
                [{ name: "content.i18n", locales: ["de-DE", "it-IT"] }, { name: "pb.page" }],
                identityA
            ]
        ];

        await until(
            useGqlHandler().listPages,
            ([res]) => res.data.pageBuilder.listPages.data.length === 4
        );

        for (let i = 0; i < insufficientPermissions.length; i++) {
            const [permissions, identity] = insufficientPermissions[i];
            const { listPages } = useGqlHandler({ permissions, identity });
            const [response] = await listPages();
            expect(response).toMatchObject(NOT_AUTHORIZED_RESPONSE("listPages"));
        }

        const sufficientPermissionsAll = [
            [[{ name: "content.i18n" }, { name: "content.i18n" }, { name: "pb.page" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "r" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rw" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rwd" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.*" }], identityA],
            [[{ name: "content.i18n", locales: ["en-US"] }, { name: "pb.page" }], identityA]
        ];

        for (let i = 0; i < sufficientPermissionsAll.length; i++) {
            const [permissions, identity] = sufficientPermissionsAll[i];
            const { listPages } = useGqlHandler({ permissions, identity });
            const [response] = await listPages();
            expect(response).toMatchObject({
                data: {
                    pageBuilder: {
                        listPages: {
                            data: [
                                {
                                    status: "draft",
                                    locked: false,
                                    publishedOn: null,
                                    createdBy: {
                                        id: "b",
                                        displayName: "Bb"
                                    }
                                },
                                {
                                    status: "draft",
                                    locked: false,
                                    publishedOn: null,
                                    createdBy: {
                                        id: "b",
                                        displayName: "Bb"
                                    }
                                },
                                {
                                    status: "draft",
                                    locked: false,
                                    publishedOn: null,
                                    createdBy: {
                                        id: "a",
                                        displayName: "Aa"
                                    }
                                },
                                {
                                    status: "draft",
                                    locked: false,
                                    publishedOn: null,
                                    createdBy: {
                                        id: "a",
                                        displayName: "Aa"
                                    }
                                }
                            ],
                            error: null
                        }
                    }
                }
            });
        }

        let identityAHandler = useGqlHandler({
            permissions: [{ name: "content.i18n" }, { name: "pb.page", own: true }],
            identity: identityA
        });

        let [response] = await identityAHandler.listPages();
        expect(response).toMatchObject({
            data: {
                pageBuilder: {
                    listPages: {
                        data: [
                            {
                                createdBy: {
                                    displayName: "Aa",
                                    id: "a"
                                },
                                status: "draft",
                                locked: false,
                                publishedOn: null
                            },
                            {
                                createdBy: {
                                    displayName: "Aa",
                                    id: "a"
                                },
                                status: "draft",
                                locked: false,
                                publishedOn: null
                            }
                        ],
                        error: null
                    }
                }
            }
        });

        identityAHandler = useGqlHandler({
            permissions: [{ name: "content.i18n" }, { name: "pb.page", own: true }],
            identity: identityB
        });

        [response] = await identityAHandler.listPages();
        expect(response).toMatchObject({
            data: {
                pageBuilder: {
                    listPages: {
                        data: [
                            {
                                createdBy: {
                                    displayName: "Bb",
                                    id: "b"
                                },
                                status: "draft",
                                locked: false,
                                publishedOn: null
                            },
                            {
                                createdBy: {
                                    displayName: "Bb",
                                    id: "b"
                                },
                                status: "draft",
                                locked: false,
                                publishedOn: null
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });

    test(`allow createPage if identity has sufficient permissions`, async () => {
        const insufficientPermissions = [
            [[], null],
            [[], identityA],
            [[{ name: "pb.page", own: false, rwd: "r" }], identityA],
            [[{ name: "pb.page", own: false, rwd: "rd" }], identityA],
            [
                [{ name: "content.i18n", locales: ["de-DE", "it-IT"] }, { name: "pb.page" }],
                identityA
            ]
        ];

        for (let i = 0; i < insufficientPermissions.length; i++) {
            const [permissions, identity] = insufficientPermissions[i];
            const { createPage } = useGqlHandler({ permissions, identity });

            const [response] = await createPage({ data: new Mock() });
            expect(response).toMatchObject(NOT_AUTHORIZED_RESPONSE("createPage"));
        }

        const sufficientPermissions = [
            [[{ name: "content.i18n" }, { name: "pb.page" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "w" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rw" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rwd" }], identityA],
            [[{ name: "content.i18n", locales: ["en-US"] }, { name: "pb.page" }], identityA]
        ];

        for (let i = 0; i < sufficientPermissions.length; i++) {
            const [permissions, identity] = sufficientPermissions[i];
            const { createPage } = useGqlHandler({ permissions, identity });

            const [response] = await createPage({ category: initialCategory.slug });
            expect(response).toMatchObject({
                data: {
                    pageBuilder: {
                        createPage: {
                            data: {
                                status: "draft"
                            },
                            error: null
                        }
                    }
                }
            });
        }
    });

    test(`allow "updatePage" if identity has sufficient permissions`, async () => {
        const { createPage } = defaultHandler;

        const page = await createPage({ category: initialCategory.slug }).then(
            ([res]) => res.data.pageBuilder.createPage.data
        );

        const insufficientPermissions = [
            [[], null],
            [[], identityA],
            [[{ name: "pb.page", rwd: "r" }], identityA],
            [[{ name: "pb.page", rwd: "rd" }], identityA],
            [[{ name: "pb.page", own: true }], identityB],
            [
                [{ name: "content.i18n", locales: ["de-DE", "it-IT"] }, { name: "pb.page" }],
                identityA
            ]
        ];

        for (let i = 0; i < insufficientPermissions.length; i++) {
            const [permissions, identity] = insufficientPermissions[i];
            const { updatePage } = useGqlHandler({ permissions, identity });
            const [response] = await updatePage({
                id: page.id,
                data: {
                    title: `${page.title}-UPDATED`
                }
            });
            expect(response).toMatchObject(NOT_AUTHORIZED_RESPONSE("updatePage"));
        }

        const sufficientPermissions = [
            [[{ name: "content.i18n" }, { name: "pb.page" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "w" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rw" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rwd" }], identityA],
            [[{ name: "content.i18n", locales: ["en-US"] }, { name: "pb.page" }], identityA]
        ];

        for (let i = 0; i < sufficientPermissions.length; i++) {
            const [permissions, identity] = sufficientPermissions[i];
            const { updatePage } = useGqlHandler({ permissions, identity });
            const [response] = await updatePage({
                id: page.id,
                data: { title: `${page.title}-UPDATED-${i}` }
            });
            expect(response).toMatchObject({
                data: {
                    pageBuilder: {
                        updatePage: {
                            data: {
                                title: `${page.title}-UPDATED-${i}`
                            },
                            error: null
                        }
                    }
                }
            });
        }
    });

    test(`allow "deletePage" if identity has sufficient permissions`, async () => {
        const { createPage } = defaultHandler;
        const page = await createPage({ category: initialCategory.slug }).then(
            ([res]) => res.data.pageBuilder.createPage.data
        );

        const insufficientPermissions = [
            [[], null],
            [[], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "r" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rw" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityB],
            [
                [{ name: "content.i18n", locales: ["de-DE", "it-IT"] }, { name: "pb.page" }],
                identityA
            ]
        ];

        for (let i = 0; i < insufficientPermissions.length; i++) {
            const [permissions, identity] = insufficientPermissions[i];
            const { deletePage } = useGqlHandler({ permissions, identity });
            const [response] = await deletePage({ id: page.id });
            expect(response).toMatchObject(NOT_AUTHORIZED_RESPONSE("deletePage"));
        }

        const sufficientPermissions = [
            [[{ name: "content.i18n" }, { name: "pb.page" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "wd" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rwd" }], identityA],
            [
                [
                    { name: "content.i18n" },
                    { name: "content.i18n", locales: ["en-US"] },
                    { name: "pb.page" }
                ],
                identityA
            ]
        ];

        for (let i = 0; i < sufficientPermissions.length; i++) {
            const [permissions, identity] = sufficientPermissions[i];
            const { createPage, deletePage } = useGqlHandler({ permissions, identity });

            const page = await createPage({ category: initialCategory.slug }).then(
                ([res]) => res.data.pageBuilder.createPage.data
            );
            const [response] = await deletePage({
                id: page.id
            });

            expect(response).toMatchObject({
                data: {
                    pageBuilder: {
                        deletePage: {
                            data: {
                                id: page.id
                            },
                            error: null
                        }
                    }
                }
            });
        }
    });

    test(`allow "getPage" if identity has sufficient permissions`, async () => {
        const { createPage } = defaultHandler;
        const page = await createPage({ category: initialCategory.slug }).then(
            ([res]) => res.data.pageBuilder.createPage.data
        );

        const insufficientPermissions = [
            [[], null],
            [[], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "w" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "wd" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityB],
            [
                [{ name: "content.i18n", locales: ["de-DE", "it-IT"] }, { name: "pb.page" }],
                identityA
            ]
        ];

        for (let i = 0; i < insufficientPermissions.length; i++) {
            const [permissions, identity] = insufficientPermissions[i];
            const { getPage } = useGqlHandler({ permissions, identity });
            const [response] = await getPage({ id: page.id });
            expect(response).toMatchObject(NOT_AUTHORIZED_RESPONSE("getPage"));
        }

        const sufficientPermissions = [
            [[{ name: "content.i18n" }, { name: "pb.page" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", own: true }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "r" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rw" }], identityA],
            [[{ name: "content.i18n" }, { name: "pb.page", rwd: "rwd" }], identityA],
            [
                [
                    { name: "content.i18n" },
                    { name: "content.i18n", locales: ["en-US"] },
                    { name: "pb.page" }
                ],
                identityA
            ]
        ];

        for (let i = 0; i < sufficientPermissions.length; i++) {
            const [permissions, identity] = sufficientPermissions[i];
            const { getPage } = useGqlHandler({ permissions, identity });
            const [response] = await getPage({ id: page.id });
            expect(response).toMatchObject({
                data: {
                    pageBuilder: {
                        getPage: {
                            data: {
                                status: "draft",
                                locked: false,
                                publishedOn: null,
                                createdBy: {
                                    displayName: "Aa",
                                    id: "a"
                                },
                                createdOn: /^20/
                            },
                            error: null
                        }
                    }
                }
            });
        }
    });
});
