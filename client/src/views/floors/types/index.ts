export interface Floor {
  id: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFloorPayload {
  name: string;
  number: number;
}
