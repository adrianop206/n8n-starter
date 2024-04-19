import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WhatsAppApiCredentials implements ICredentialType {
	name: string = 'whatsAppApiCredential';
	displayName: string = 'WhatsApp API Credential';
	documentationUrl: string = 'https://app.talkb.ee/developers/apikeys';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
		},
	];
}
