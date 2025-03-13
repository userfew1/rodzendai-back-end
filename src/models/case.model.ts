import db from "../connect_Firestore";


export interface CaseDocument {
  case_id: number;
  status: string;
  recorded_by: string;
  recorded_date: string;
  reason?: string;
  cause?: string;
  appointment_results: {
    notes: string;
    outcome: boolean;
  };
  patient_info: {
    full_name: string;
    patient_type: string;
    service_type: string;
    national_id: string;
    date_of_birth: string;
    phone_number: string;
    photo_document: string;
    mobility_ability: string;
    medical_diagnosis: string;
  };
  appointment_info: {
    appointment_date: string;
    appointment_time: string;
    hospital_name: string;
    hospital_code: string;
    photo_document: string;
    type_document: string;
  };
  reporter_info: {
    full_name: string;
    relation_to_patient: string;
    phone_number: string;
  };
  companions: {
    full_name: string;
    relation_to_patient: string;
    phone_number: string;
  }[];
  transportationTypes: string;
  transport_request: {
    departure_schedule: boolean;
    return_schedule: boolean;
    pickup_location: {
      pickup_place: string;
      province: string;
      district: string;
      subdistrict: string;
      landmark: string;
    };
    dropoff_location: {
      dropoff_place: string;
      province: string;
      district: string;
      subdistrict: string;
      landmark: string;
    };
  };
  travel_mode: {
    transit_at: string;
    pickup_place_map: string;
    dropoff_place: string;
    shuttle_type: string;
    shuttle_service_name: string;
    service_date: string;
    distance_km: string;
    pickup_time: string;
    dropoff_time: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const caseCollection = db.collection("cases");

export default caseCollection;
