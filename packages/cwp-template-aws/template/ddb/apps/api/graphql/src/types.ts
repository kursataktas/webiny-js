import { ClientContext } from "@webiny/handler-client/types";
import { TenancyContext } from "@webiny/api-tenancy/types";
import { SecurityContext } from "@webiny/api-security/types";
import { I18NContext } from "@webiny/api-i18n/types";
import { I18NContentContext } from "@webiny/api-i18n-content/types";
import { PbContext } from "@webiny/api-page-builder/graphql/types";
import { PrerenderingServiceClientContext } from "@webiny/api-prerendering-service/client/types";
import { FileManagerContext } from "@webiny/api-file-manager/types";
import { FormBuilderContext } from "@webiny/api-form-builder/types";
import { CmsContext } from "@webiny/api-headless-cms/types";
import { AcoContext } from "@webiny/api-aco/types";
import { PbAcoContext } from "@webiny/api-page-builder-aco/types";
import { HcmsAcoContext } from "@webiny/api-headless-cms-aco/types";
import { HcmsTasksContext } from "@webiny/api-headless-cms-tasks/types";

// When working with the `context` object (for example while defining a new GraphQL resolver function),
// you can import this interface and assign it to it. This will give you full autocomplete functionality
// and type safety. The easiest way to import it would be via the following import statement:
// import { Context } from "~/types";
// Feel free to extend it with additional context interfaces, if needed. Also, please do not change the
// name of the interface, as existing scaffolding utilities may rely on it during the scaffolding process.
export interface Context
    extends ClientContext,
        TenancyContext,
        SecurityContext,
        I18NContext,
        I18NContentContext,
        PbContext,
        PrerenderingServiceClientContext,
        FileManagerContext,
        FormBuilderContext,
        AcoContext,
        PbAcoContext,
        HcmsAcoContext,
        HcmsTasksContext,
        CmsContext {}
