import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  customerType: "Business" | "Individual";
  primaryContact: {
    salutation?: string;
    firstName: string;
    lastName: string;
  };
  companyName?: string;
  displayName: string;
  email: string;
  phone: {
    workPhone?: string;
    mobile?: string;
  };

  // Addresses
  billingAddress: {
    attention?: string;
    country: string;
    address: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
    faxNumber?: string;
  };
  shippingAddress?: {
    attention?: string;
    country: string;
    address: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
    faxNumber?: string;
  };

  // Contact Persons
  contactPersons?: Array<{
    salutation?: string;
    firstName: string;
    lastName: string;
    email?: string;
    workPhone?: string;
    mobile?: string;
  }>;

  // Other Details
  taxId?: string;
  companyId?: string;
  currency: string;
  paymentTerms: string;
  enablePortal?: boolean;
  portalLanguage?: string;

  // Custom Fields
  customFields?: Record<string, any>;

  // Reporting Tags
  reportingTags?: string[];

  // Remarks
  remarks?: string;

  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    customerType: {
      type: String,
      enum: ["Business", "Individual"],
      required: true,
    },
    primaryContact: {
      salutation: String,
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    companyName: String,
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      workPhone: String,
      mobile: String,
    },

    billingAddress: {
      attention: String,
      country: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      street2: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      phone: String,
      faxNumber: String,
    },
    shippingAddress: {
      attention: String,
      country: String,
      address: String,
      street2: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
      faxNumber: String,
    },

    contactPersons: [
      {
        salutation: String,
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        email: String,
        workPhone: String,
        mobile: String,
      },
    ],

    taxId: String,
    companyId: String,
    currency: {
      type: String,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    enablePortal: {
      type: Boolean,
      default: false,
    },
    portalLanguage: {
      type: String,
      default: "English",
    },

    customFields: Schema.Types.Mixed,
    reportingTags: [String],
    remarks: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
