const sendNotification = async (payload) => {
  const webhookUrl = process.env.N8N_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N_NOTIFICATION_WEBHOOK_URL is not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        'n8n notification failed:',
        response.status,
        text
      );
      return;
    }

    console.log(`Notification sent: ${payload.type}`);
  } catch (error) {
    console.error(
      'Error sending notification:',
      error.message
    );
  }
};

module.exports = {
  sendNotification
};
