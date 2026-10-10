interface FacebookPageSubscribedRequest {
  success?: boolean;
  error?: FacebookPageRegisterMetaAppError;
}

interface FacebookPageRegisterMetaAppError {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  fbtrace_id: string;
}

export type { FacebookPageSubscribedRequest };
