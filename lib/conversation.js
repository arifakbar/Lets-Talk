const { db } = require("./db");

export const getOrCreateConversation = async (memberOneId, memberTwoId) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation)
    conversation = await createNewConversation(memberOneId, memberTwoId);

  return conversation;
};

const findConversation = async (memberOneId, memberTwoId) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId, memberTwoId }],
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
  } catch (err) {
    return null;
  }
};

const createNewConversation = async (memberOneId, memberTwoId) => {
  try {
    return await db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
  } catch (err) {
    return null;
  }
};
