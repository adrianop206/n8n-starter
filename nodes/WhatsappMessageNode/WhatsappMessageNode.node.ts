import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class WhatsAppMessageNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'WhatsApp Message Sender',
        name: 'whatsAppMessageSender',
        group: ['communication'],
        version: 1,
        description: 'Sends a message via WhatsApp',
        defaults: {
            name: 'Send WhatsApp Message',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'whatsAppApiCredential',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Phone Number',
                name: 'phoneNumber',
                type: 'string',
                default: '',
                placeholder: '+1234567890',
                description: 'The phone number to send the message to in E164 format',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                placeholder: 'Hello, world!',
                description: 'The message text to send',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnItems: INodeExecutionData[] = [];

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
            const message = this.getNodeParameter('message', itemIndex) as string;
            const credentials = this.getCredentials('whatsAppApiCredential');
					

            if (credentials === undefined) {
                throw new NodeOperationError(this.getNode(), 'No credentials were returned!');
            }

            const apiToken = credentials.apiToken as string;

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': apiToken
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    message: message
                }),
                uri: 'https://api.talkb.ee/v1/messages'
            };

            try {
                const responseData = await this.helpers.request(options);
                returnItems.push({ json: responseData });
            } catch (error) {
                if (this.continueOnFail()) {
                    returnItems.push({ json: { error: error.message }, pairedItem: itemIndex });
                } else {
                    throw new NodeOperationError(this.getNode(), error, { itemIndex });
                }
            }
        }

        return this.prepareOutputData(returnItems);
    }
}
