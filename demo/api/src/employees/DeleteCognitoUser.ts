import { CognitoIdentityProvider } from "@webiny/aws-sdk/client-cognito-identity-provider";
import { Email } from "./Email";

export class DeleteCognitoUser {
    private cognito: CognitoIdentityProvider;
    private readonly userPoolId: string;

    constructor(cognito: CognitoIdentityProvider, userPoolId: string) {
        this.cognito = cognito;
        this.userPoolId = userPoolId;
    }

    async execute(email: string): Promise<void> {
        const username = Email.create(email);

        await this.cognito.adminDeleteUser({ UserPoolId: this.userPoolId, Username: username });
    }
}
