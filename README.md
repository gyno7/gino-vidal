# n8n Chatbot Widget Template

A fully customizable, lightweight JavaScript chat widget designed to plug directly into any HTML or WordPress site. Built to work with n8n Webhooks, this widget allows you to build a conversational UI powered by any backend logic—perfect for automations, FAQs, lead capture, support bots, and more.

## 🚀 Features

- **Lightweight & Fast**: Single JavaScript file with no external dependencies
- **Fully Customizable**: Colors, branding, positioning, and styling
- **n8n Integration**: Seamless integration with n8n webhooks
- **Session Management**: Automatic session handling with UUID generation
- **Responsive Design**: Modern UI with smooth animations
- **Cross-Platform**: Works on any website or WordPress site
- **Easy Setup**: Simple configuration object for quick deployment

## 📋 How It Works

1. **User clicks the chat button** and starts a new session
2. **The widget sends a `loadPreviousSession` request** to the webhook
3. **When a user sends a message**, the widget sends a `sendMessage` request with `sessionId`, `chatInput`, and `metadata`
4. **The webhook responds** with either a single output or an array with the `output` field to display

## 🛠️ Installation

### Method 1: Direct Script Include (Recommended)

Add the following code to your HTML page's `<head>` or before the closing `</body>` tag:

```html
<!-- Widget Configuration -->
<script>
    window.ChatWidgetConfig = {
        webhook: {
            url: 'YOUR_N8N_WEBHOOK_URL',
            route: 'your-route-name'
        },
        branding: {
            logo: 'YOUR_LOGO_URL',
            name: 'Your Company Name',
            welcomeText: 'Hi 👋, how can we help?',
            responseTimeText: 'We typically respond right away'
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right', // 'left' or 'right'
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };
</script>

<!-- Widget Script -->
<script src="https://cdn.jsdelivr.net/gh/juansebsol/n8n-chatbot-template@latest/chat-widget.js"></script>
```

### Method 2: Self-Hosted

1. Download the `chat-widget.js` file
2. Upload it to your server
3. Update the script src to point to your hosted file

## ⚙️ Configuration Options

### Webhook Configuration
```javascript
webhook: {
    url: 'https://your-n8n-instance.com/webhook/your-webhook-id/chat',
    route: 'general' // Optional route identifier
}
```

### Branding Configuration
```javascript
branding: {
    logo: 'https://your-domain.com/logo.png',
    name: 'Your Company Name',
    welcomeText: 'Hi 👋, how can we help?',
    responseTimeText: 'We typically respond right away',
    poweredBy: {
        text: 'Powered by Your Brand',
        link: 'https://your-website.com'
    }
}
```

### Style Configuration
```javascript
style: {
    primaryColor: '#854fff',     // Primary brand color
    secondaryColor: '#6b3fd4',   // Secondary brand color
    position: 'right',           // 'left' or 'right'
    backgroundColor: '#ffffff',  // Widget background
    fontColor: '#333333'         // Text color
}
```

## 🔌 n8n Webhook Integration

### Expected Webhook Payload Format

The widget sends POST requests to your n8n webhook with the following structure:

#### Load Previous Session
```json
[
  {
    "action": "loadPreviousSession",
    "sessionId": "1234-5678-90ab-cdef",
    "route": "general",
    "metadata": {
      "userId": ""
    }
  }
]
```

#### Send Message
```json
[
  {
    "action": "sendMessage",
    "sessionId": "1234-5678-90ab-cdef",
    "route": "general",
    "chatInput": "User's message here",
    "metadata": {
      "userId": ""
    }
  }
]
```

### Expected Response Format

Your n8n workflow should respond with either:

#### Single Response
```json
{
  "output": "Your bot's response message"
}
```

#### Array Response
```json
[
  {
    "output": "Your bot's response message"
  }
]
```

## 🎨 Customization Examples

### Different Color Schemes

#### Blue Theme
```javascript
style: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    fontColor: '#1f2937'
}
```

#### Green Theme
```javascript
style: {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    backgroundColor: '#ffffff',
    fontColor: '#1f2937'
}
```

#### Dark Theme
```javascript
style: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    backgroundColor: '#1f2937',
    fontColor: '#f9fafb'
}
```

### Left Positioned Widget
```javascript
style: {
    position: 'left',
    // ... other style options
}
```

## 🔧 Advanced Usage

### WordPress Integration

Add the widget to your WordPress site by:

1. **Using a Custom HTML Block** (Gutenberg)
2. **Adding to your theme's footer.php**
3. **Using a plugin like "Header and Footer Scripts"**

### Multiple Widgets

To prevent conflicts, the widget automatically prevents multiple initializations. If you need multiple widgets, you'll need to modify the script to use different class names and initialization flags.

### Custom Metadata

You can extend the metadata object to include additional user information:

```javascript
// In your n8n workflow, you can access:
// - sessionId: Unique session identifier
// - route: Route identifier for different chat flows
// - chatInput: User's message
// - metadata: Custom user data
```

## 🐛 Troubleshooting

### Widget Not Appearing
- Check browser console for JavaScript errors
- Ensure the script is loaded after the configuration
- Verify the webhook URL is accessible

### Messages Not Sending
- Check n8n webhook URL is correct
- Verify CORS settings in n8n
- Check browser network tab for failed requests

### Styling Issues
- Ensure CSS variables are properly set
- Check for conflicting CSS on your site
- Verify color values are valid hex codes

## 🔗 Related Links

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Webhooks Guide](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
