const MOCK_DATA = [
  '550e8400-e29b-41d4-a716-446655440000',
  '123e4567-e89b-12d3-a456-556642440000',
  '3fae45b2-d30a-47a2-bd5c-aa41f7a36495',
  '6f580b3f-dc28-4b68-986d-7cde7c4609b1',
  '34d62517-9a26-4988-97de-6c233c1a5c45',
  'a5d61de3-94a0-44b7-8dfb-84c0829a4e21',
  '85e579d7-d935-4ec0-8b33-32f2b8a64994',
  'f00c55d4-45a3-4653-9882-f1373f39b8db',
  '0a1d5873-5a88-475b-856b-d94b10dc2a50',
  '7602f8c1-5b0a-484b-8eac-5b3e8bcda474',
  'b13ccde3-0f07-4c2b-8e57-1c4f94b5791e',
  '6b1b2864-3b18-448a-9e28-f9dd3d6a3ef6',
  '4b6ee94f-4822-4d14-9fe2-5d6b21ec7aa6',
  'f3e8a0d8-4095-45cc-9f8e-4d672937bcbd',
  '3e8cf3c5-3f97-4a9d-bb0f-31a31b11f35b',
  'b62c86c5-3079-4342-9b57-f27bfa5a2ae1',
  '87de7c7d-509e-4e05-91b8-52e9825271a3',
  '84bfea95-d55e-4bcf-a43b-853432b9491e',
  'aae30a48-7f63-4e26-ae3d-5a6f06ad57f3',
  'b6b3b4d0-38cb-4853-9773-65c620d1810c',
  'bfdc7b29-fa0f-4e9b-a8d2-5dd0b7c83621',
  '91d17d48-7c7d-4ebc-bc46-d5001985e502',
  'f78f271e-6e0c-4290-a7bc-198064962124',
  'ce4fb7e8-8887-45f0-bca3-8759145d3cfd',
  '4322d8cf-c12d-45ff-804b-d94c6079ffaf',
  'a0ff7ff6-04d9-4948-b3e7-1d39b7c2d0e7',
  '5f8f08f5-e91b-46f0-96ad-baa79a24e1ed',
  'db0b28fd-3da7-4cd5-92b4-00e99e74b2e0',
  '1206a458-7b9c-4fc4-97d0-fdb8825a8d1d',
  'cfd9f06a-0a94-4bcf-af76-1c4a91e4e2c2',
  '06aef8b2-3db0-4d54-bc39-8e994a80a104',
  'e8d8f2f8-b77a-4993-985d-1e7c16521bb8',
  'd8d8d00c-0b07-4d1e-bccf-2040b0585c88',
  'ee2a5420-60b8-4e7a-b4c0-8697367e0028',
  '821fb217-eec9-44d1-a01c-b1f6b70b71c1',
  '7f4b9215-7466-48d7-8ef1-437d1eb7bb7f',
  '7f4b9215-7466-48d7-8ef1-437d1eb7bb7f',
  'ebd6ff77-3f84-4e85-9187-2b8492aa9d34',
  '822f2140-5a26-4d09-a171-f0e36b1c0e11',
  'f118da4e-65bb-478e-b607-92e605ed9b35',
  '3e8b1a61-b10a-426b-9269-f25cf6b69f22',
  'bb988df9-3b81-4e7e-b49f-ef3d5a8392d2',
  'ef4ff97e-02c9-4a8c-8c44-befc1a4ef74b',
  'b0131ed3-98cf-4bfb-afe5-0a24f5144b07',
  '4d7399fd-6d16-4735-bc39-6aa11d34983a',
  'cb4f23ab-5d6e-42fd-a153-17556bfbf5d0',
  '620632e9-e79b-4f6b-bf92-095a595b715f',
  '8e94391b-4c6e-46ef-9531-5ac1e051e964',
  '4a6c5c56-e39d-4346-b4d3-30fc7610ee53',
  '5a5e70e2-23e3-415e-8b73-89169f8a91a1',
  'a73d5a2f-11eb-48bb-b2f3-30131520ec9f',
  'c22b67a3-3151-4ed5-b2a2-c4692b6978fb',
  '9dbf047e-cfd3-44c0-a77c-f0e17604ff6c',
  'b4d4dbf7-cc7c-4e95-bf2f-0256aa1a3e57',
  'd6d26790-1815-4b5b-8baf-c3ec5e5b70a2',
  'b6600fd5-6a78-4e02-8f14-76c4dc5a3a8e',
  'f0c2180a-7ba9-4983-bd6d-11a632b27aa0',
];

class UUIDGenerator {
  private current: number = 0;

  next(): string {
    if (this.current >= MOCK_DATA.length) {
      throw new Error('Out of data');
    }
    return MOCK_DATA[this.current++];
  }
}

const GENERATOR = new UUIDGenerator();

export function mockUuid() {
  return GENERATOR.next();
}
