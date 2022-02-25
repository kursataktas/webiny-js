import * as aws from "@pulumi/aws";

import {
    defineApp,
    createGenericApplication,
    mergeAppHooks,
    ApplicationContext,
    ApplicationHooks
} from "@webiny/pulumi-sdk";

import { createPublicAppBucket } from "../createAppBucket";
import { adminUpload } from "./AdminHookUpload";

export interface AdminAppConfig extends ApplicationHooks {
    config?(app: AdminApp, ctx: ApplicationContext): void;
}

export const AdminApp = defineApp({
    name: "Admin",
    config(app) {
        const bucket = createPublicAppBucket(app, "admin-app");

        const cloudfront = app.addResource(aws.cloudfront.Distribution, {
            name: "admin-app-cdn",
            config: {
                enabled: true,
                waitForDeployment: false,
                origins: [bucket.origin],
                defaultRootObject: "index.html",
                defaultCacheBehavior: {
                    compress: true,
                    targetOriginId: bucket.origin.originId,
                    viewerProtocolPolicy: "redirect-to-https",
                    allowedMethods: ["GET", "HEAD", "OPTIONS"],
                    cachedMethods: ["GET", "HEAD", "OPTIONS"],
                    forwardedValues: {
                        cookies: { forward: "none" },
                        queryString: false
                    },
                    // MinTTL <= DefaultTTL <= MaxTTL
                    minTtl: 0,
                    defaultTtl: 600,
                    maxTtl: 600
                },
                priceClass: "PriceClass_100",
                customErrorResponses: [
                    { errorCode: 404, responseCode: 404, responsePagePath: "/index.html" }
                ],
                restrictions: {
                    geoRestriction: {
                        restrictionType: "none"
                    }
                },
                viewerCertificate: {
                    cloudfrontDefaultCertificate: true
                }
            }
        });

        app.addOutputs({
            appStorage: bucket.bucket.output.id,
            appUrl: cloudfront.output.domainName.apply(value => `https://${value}`)
        });

        return {
            ...bucket,
            cloudfront
        };
    }
});

export type AdminApp = InstanceType<typeof AdminApp>;

export function createAdminApp(config: AdminAppConfig) {
    return createGenericApplication({
        id: "admin",
        name: "admin",
        description: "Your project's admin area.",
        cli: {
            // Default args for the "yarn webiny watch ..." command (we don't need deploy option while developing).
            watch: {
                deploy: false
            }
        },
        app(ctx) {
            const app = new AdminApp(ctx);
            config.config?.(app, ctx);
            return app;
        },
        beforeBuild: config.beforeBuild,
        afterBuild: config.afterBuild,
        beforeDeploy: config.beforeDeploy,
        afterDeploy: mergeAppHooks(adminUpload, config.afterDeploy)
    });
}
