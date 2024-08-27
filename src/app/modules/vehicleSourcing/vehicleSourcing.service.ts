import vehicleEmailSender from "./vehicleSourceEmailSend";
import { VehicleSource } from "./vehicleSourcing.interface";

const vehicleSourcingEmailSend = async (payload: VehicleSource) => {
  try {
    const result = await vehicleEmailSender(
      payload.email,
      `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h1 style="background-color: #007BFF; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
              Vehicle Sourcing Request
            </h1>
            
            <div style="padding: 20px;">
              <p style="margin: 10px 0;">
                <strong>Email:</strong> 
                <span style="color: #555;">${payload.email}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Model:</strong> 
                <span style="color: #555;">${payload.model}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Manufacturer:</strong> 
                <span style="color: #555;">${payload.manufacturer}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Preferred Year:</strong> 
                <span style="color: #555;">${payload.preferredYear ?? "N/A"}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Maximum Budget:</strong> 
                <span style="color: #555;">${payload.maximumBudget ?? "N/A"}</span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Message:</strong> 
                <span style="color: #555;">${payload.message}</span>
              </p>
            </div>
</div>

            `
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const vehicleSourcingService = {
  vehicleSourcingEmailSend,
};
