export class Lead {
    id = 0;
    ownerEmailId: string = '';
    ownerName: string = '';
    company: string = '';
    fullName: string = '';
    title: string = '';
    leadSource: string = '';
    status: string = 'Lead Created';

    industryType: string = '';
    noOfEmployees: string = '';
    annualRevenue: string = '';

    email: string = '';
    alternateEmail: string = '';
    phone: string = '';
    alternatePhone: string = '';
    website: string = '';

    street: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    pincode: string = '';

    description: string = '';

    sendEmailUpdates: boolean = true;

    products: string = '';
    files: string = '';

    leadDate: Date = new Date();

    createddatetime: Date = null;
    lastupdatedatetime: Date = null;

}