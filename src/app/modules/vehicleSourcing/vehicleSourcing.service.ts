import vehicleEmailSender from "./vehicleSourceEmailSend";
import { VehicleSource } from "./vehicleSourcing.interface";

const vehicleSourcingEmailSend = async (payload: VehicleSource) => {
  try {
    const result= await vehicleEmailSender(
      payload.email,
      `
                <h1>Vehicle Sourcing Request</h1>
                <p><strong>Name:</strong> ${payload.name}</p>
                <p><strong>Email:</strong> ${payload.email}</p>
                <p><strong>Model:</strong> ${payload.model}</p>
                <p><strong>Manufacturer:</strong> ${payload.manufacturer}</p>
                <p><strong>Preferred Year:</strong> ${
                  payload.preferredYear ?? "N/A"
                }</p>
                <p><strong>Maximum Budget:</strong> ${
                  payload.maximumBudget ?? "N/A"
                }</p>
                <p><strong>Message:</strong> ${payload.message}</p>
            `
    );
    return result
  } catch (error) {
    console.log(error);
  }
};

export const vehicleSourcingService = {
  vehicleSourcingEmailSend,
};
