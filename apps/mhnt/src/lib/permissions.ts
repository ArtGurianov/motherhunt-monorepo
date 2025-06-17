import { createAccessControl } from "better-auth/plugins/access";

const entitiesActions = {
  // Users
  admin: ["update"],
  moderator: ["create", "update", "delete"],
  headBooker: ["create", "update", "ban"],
  booker: ["create", "update", "ban"],
  scouter: ["create", "update", "ban"],

  // Entities
  organization: ["create", "update"],
  lot: ["create", "update", "ban"],
  bid: ["create", "update"],
} as const;

const accessControl = createAccessControl(entitiesActions);

export const appAdminRole = accessControl.newRole({
  admin: ["update"],
  moderator: ["create", "update", "delete"],
  headBooker: ["create", "update", "ban"],
  booker: ["create", "update", "ban"],
  scouter: ["create", "update", "ban"],
});

export const appModeratorRole = accessControl.newRole({
  headBooker: ["create", "update", "ban"],
  booker: ["create", "update", "ban"],
  scouter: ["create", "update", "ban"],
});

export const apphHeadBookerRole = accessControl.newRole({
  booker: ["create", "update", "ban"],
});

export const appBookerRole = accessControl.newRole({
  booker: [],
});

export const appScouterRole = accessControl.newRole({
  scouter: ["create", "update"],
});
