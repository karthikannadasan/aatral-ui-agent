export class LeadMailTemplate {

    id: number = 0;
    title: string = '';
    subject: string = '';
    message: string = '';

    status: string = 'All Status';

    frequency: string = 'Daily';

    enabled: boolean = true;

    // daily: boolean = false;
    // weekly: boolean = false;
    // biweekly: boolean = false;
    // monthly: boolean = false;
    // bimonthly: boolean = false;
    // quarterly: boolean = false;

    createddatetime: Date = null;
    lastupdatedatetime: Date = null;

}