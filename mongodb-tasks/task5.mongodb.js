use('squadhelp-chat-dev');

db.messages.aggregate([
  {
    $match: {
      body: { $regex: 'паровоз', $options: 'i' },
    },
  },
  {
    $count: 'count',
  },
]);
