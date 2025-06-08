export interface WarrantyDocument {
  id: string;
  warranty_id: string;
  name: string;
  file_path: string;
  file_type: string;
  size: number;
  uploaded_at: string;
  document?: {
    createElement: (type: string) => HTMLAnchorElement;
    body: {
      appendChild: (element: HTMLAnchorElement) => void;
      removeChild: (element: HTMLAnchorElement) => void;
    };
  };
}
