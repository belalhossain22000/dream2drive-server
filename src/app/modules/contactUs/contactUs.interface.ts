export interface ContactForm {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}
