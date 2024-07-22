export interface FormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  country: string;
  email: string;
  isCompanyEnquiry: boolean;
  companyName: string;
  phoneNumber?: string; // Optional field
}

export interface Errors {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  country?: string;
  email?: string;
  companyName?: string;
  phoneNumber?: string;
}
