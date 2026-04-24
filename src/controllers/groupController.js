import Group from "../database/models/Group.js";
import GroupMember from "../database/models/GroupMembers.js";

// create group (leader only)
export const createGroup = async (req, res) => {
  const group = await Group.create({
    name: req.body.name,
    leaderId: req.user.id
  });

  res.json(group);
};

export const addMember = async (req, res) => {
  const { groupId, motariId } = req.body;

  const member = await GroupMember.create({
    groupId,
    motariId
  });

  res.json(member);
};

export const suspendMember = async (req, res) => {
  const member = await GroupMember.findOne({
    where: {
      groupId: req.body.groupId,
      motariId: req.body.motariId
    }
  });

  member.status = "SUSPENDED";
  await member.save();

  res.json(member);
};