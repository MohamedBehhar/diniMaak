const emitToUserId = (io, userId, event, data) => {
  io.to(userId).emit(event, data);
}