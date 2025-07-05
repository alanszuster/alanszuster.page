// AI demo functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Python code demo if it exists
    initPythonDemo();

    // Initialize AI chat functionality
    initAIChat();
});

function initPythonDemo() {
    const pythonDemo = document.getElementById('python-demo');
    const demoOutput = document.getElementById('code-output');

    if (!pythonDemo || !demoOutput) return;

    const demoButtons = {
        'demo-btn-1': {
            code: getPythonServerAnalysisCode(),
            output: 'Server Status: healthy\nMetrics: {\'cpu_usage\': 45, \'memory_usage\': 60, \'disk_usage\': 72}\nAlerts: []'
        },
        'demo-btn-2': {
            code: getPythonAICode(),
            output: 'Found 2 potential issues in logs:\n[High] 2025-07-05T10:17:12: Critical error: out of memory exception\n[Medium] 2025-07-05T10:15:23: Connection timeout after 30s'
        },
        'demo-btn-3': {
            code: getPythonK8sCode(),
            output: 'Scaling up due to high CPU utilization (85%)\nScaled deployment from 2 to 4 replicas\nAutoscaling result: {\'success\': True, \'previous_replicas\': 2, \'new_replicas\': 4}'
        }
    };

    // Set up button event listeners
    Object.keys(demoButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                pythonDemo.textContent = demoButtons[btnId].code;
                demoOutput.innerHTML = `<pre>${demoButtons[btnId].output}</pre>`;
            });
        }
    });

    // Run code button
    const runBtn = document.getElementById('run-code');
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            demoOutput.classList.add('flash-animation');
            setTimeout(() => {
                demoOutput.classList.remove('flash-animation');
            }, 300);
        });
    }
}

function initAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (!chatInput || !sendButton || !chatMessages) return;

    // Handle sending messages
    function sendMessage(text) {
        if (!text.trim()) return;

        // Add user message to chat
        addMessageToChat('user', text);

        // Clear input
        chatInput.value = '';

        // Simulate "thinking" with a typing indicator
        showTypingIndicator();

        // Generate AI response after a short delay
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator();

            // Add AI response
            const response = generateAIResponse(text);
            addMessageToChat('ai', response);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    // Add message to chat
    function addMessageToChat(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';

        const iconElement = document.createElement('i');
        iconElement.className = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
        avatarDiv.appendChild(iconElement);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        contentDiv.appendChild(textDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';

        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-robot';
        avatarDiv.appendChild(iconElement);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = '<span class="dot-typing"></span><span class="dot-typing"></span><span class="dot-typing"></span>';

        contentDiv.appendChild(textDiv);
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);

        chatMessages.appendChild(typingDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Generate AI response based on user input
    function generateAIResponse(userInput) {
        // Convert input to lowercase for easier matching
        const input = userInput.toLowerCase();

        // Knowledge base for common SRE/DevOps questions
        const responses = {
            // SRE related
            'what is sre': 'Site Reliability Engineering (SRE) is a discipline that incorporates aspects of software engineering and applies them to infrastructure and operations problems. The main goals are to create scalable and highly reliable software systems. SRE teams focus on automation, observability, and optimizing system performance.',

            'sre best practices': 'Some SRE best practices include: implementing SLIs, SLOs, and SLAs; automating repetitive tasks; using error budgets; establishing effective on-call rotations; practicing blameless postmortems; and continuously measuring and improving system reliability.',

            'error budget': 'An error budget is a concept in SRE that quantifies the acceptable level of failure for a service. It\'s calculated as 100% minus the SLO (Service Level Objective). For example, if your SLO is 99.9% uptime, your error budget is 0.1%, which means you can have up to 43.8 minutes of downtime per month.',

            // DevOps related
            'devops': 'DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) with the goal of shortening the development lifecycle and delivering features, fixes, and updates frequently and reliably. It emphasizes communication, collaboration, integration, automation, and measurement between developers and operations teams.',

            'devops best practices': 'DevOps best practices include: continuous integration/continuous deployment (CI/CD), infrastructure as code (IaC), automated testing, microservices architecture, monitoring and observability, collaboration, and a strong security focus (DevSecOps).',

            'ci cd': 'CI/CD (Continuous Integration/Continuous Deployment) is a method to frequently deliver apps by introducing automation into the stages of app development. CI/CD automates building, testing, and deployment of applications, allowing teams to catch bugs earlier and deliver software more rapidly.',

            // Kubernetes related
            'kubernetes': 'Kubernetes (K8s) is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications. It groups containers into logical units for easy management and discovery, and provides features like self-healing, service discovery, load balancing, automated rollouts, and rollbacks.',

            'k8s': 'Kubernetes (K8s) is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications. It groups containers into logical units for easy management and discovery, and provides features like self-healing, service discovery, load balancing, automated rollouts, and rollbacks.',

            'kubernetes components': 'Key Kubernetes components include: Control Plane (API server, etcd, scheduler, controller manager), Nodes (kubelet, kube-proxy, container runtime), and abstractions like Pods, Deployments, Services, ConfigMaps, and Secrets.',

            // Cloud related
            'cloud monitoring': 'Cloud monitoring involves tracking the performance, availability, and health of cloud-based infrastructure and services. Popular cloud monitoring tools include Datadog, New Relic, Prometheus with Grafana, CloudWatch (AWS), Stackdriver (GCP), and Azure Monitor.',

            'monitoring tools': 'Popular monitoring tools for infrastructure and applications include: Prometheus, Grafana, Datadog, New Relic, Nagios, Zabbix, ELK Stack (Elasticsearch, Logstash, Kibana), Dynatrace, and cloud provider solutions like AWS CloudWatch, Google Cloud Monitoring, and Azure Monitor.',

            'cloud providers': 'Major cloud providers include Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), IBM Cloud, Oracle Cloud, and Alibaba Cloud. Each offers various computing, storage, networking, database, and specialized services (AI/ML, IoT, serverless, etc.).',
        };

        // Check for matches in our knowledge base
        for (const [keyword, response] of Object.entries(responses)) {
            if (input.includes(keyword)) {
                return response;
            }
        }

        // Check for greetings
        if (input.match(/^(hi|hello|hey|greetings).*/i)) {
            return "Hello! I'm your AI assistant. How can I help you with SRE, DevOps, or cloud technologies today?";
        }

        // Check for thanks
        if (input.match(/thank|thanks|appreciate|grateful/i)) {
            return "You're welcome! If you have more questions about SRE, DevOps, or cloud technologies, feel free to ask.";
        }

        // Check for specific technologies
        if (input.includes('docker')) {
            return "Docker is a platform for developing, shipping, and running applications in containers. Containers package an application with its dependencies, ensuring it works consistently across different environments. Docker helps standardize application deployment and improves resource utilization compared to traditional VMs.";
        }

        if (input.includes('terraform')) {
            return "Terraform is an Infrastructure as Code (IaC) tool that enables you to define and provision infrastructure resources using a declarative configuration language. It supports multiple cloud providers and services, allowing for consistent and reproducible infrastructure deployment.";
        }

        if (input.includes('prometheus')) {
            return "Prometheus is an open-source monitoring and alerting toolkit designed for reliability and scalability. It collects metrics from configured targets, stores them locally, and provides a powerful query language (PromQL) for analyzing the data. It's commonly used with Grafana for visualization.";
        }

        // Default response if no match is found
        return "I don't have specific information about that topic. I can help with questions related to SRE, DevOps practices, cloud technologies, monitoring, and related topics. Could you try rephrasing your question?";
    }

    // Set up event listeners for chat
    sendButton.addEventListener('click', () => {
        sendMessage(chatInput.value);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput.value);
        }
    });

    // Set up suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            chatInput.value = query;
            sendMessage(query);
        });
    });
}

function getPythonServerAnalysisCode() {
    return `# This is an interactive Python skills demo
# Click buttons below to see different examples

def analyze_server_metrics(metrics):
    """Analyze server metrics and return status."""
    cpu_usage = metrics.get('cpu_usage', 0)
    memory_usage = metrics.get('memory_usage', 0)
    disk_usage = metrics.get('disk_usage', 0)

    status = 'healthy'
    alerts = []

    if cpu_usage > 80:
        status = 'warning'
        alerts.append(f'High CPU usage: {cpu_usage}%')

    if memory_usage > 90:
        status = 'critical'
        alerts.append(f'Critical memory usage: {memory_usage}%')

    if disk_usage > 85:
        status = 'warning'
        alerts.append(f'High disk usage: {disk_usage}%')

    return {
        'status': status,
        'alerts': alerts,
        'metrics': metrics
    }

# Example usage
server_metrics = {
    'cpu_usage': 45,
    'memory_usage': 60,
    'disk_usage': 72
}

result = analyze_server_metrics(server_metrics)
print(f"Server Status: {result['status']}")
print(f"Metrics: {result['metrics']}")
print(f"Alerts: {result['alerts']}")`;
}

function getPythonAICode() {
    return `# AI Integration Example
from transformers import pipeline

def analyze_log_sentiment(log_entries):
    """Use AI to analyze the sentiment in log entries
    to identify potential issues."""

    # Initialize sentiment analyzer
    sentiment_analyzer = pipeline('sentiment-analysis')

    # Track issues and their severity
    potential_issues = []

    for entry in log_entries:
        # Analyze sentiment of log message
        result = sentiment_analyzer(entry['message'])[0]
        sentiment = result['label']
        confidence = result['score']

        # If negative sentiment with high confidence, flag as potential issue
        if sentiment == 'NEGATIVE' and confidence > 0.85:
            potential_issues.append({
                'timestamp': entry['timestamp'],
                'message': entry['message'],
                'confidence': confidence,
                'severity': 'High' if confidence > 0.95 else 'Medium'
            })

    return potential_issues

# Example log entries
logs = [
    {'timestamp': '2025-07-05T10:15:23', 'message': 'Connection timeout after 30s'},
    {'timestamp': '2025-07-05T10:16:45', 'message': 'Database query completed successfully'},
    {'timestamp': '2025-07-05T10:17:12', 'message': 'Critical error: out of memory exception'}
]

issues = analyze_log_sentiment(logs)
print(f"Found {len(issues)} potential issues in logs:")
for issue in issues:
    print(f"[{issue['severity']}] {issue['timestamp']}: {issue['message']}")`;
}

function getPythonK8sCode() {
    return `# Kubernetes Automation with Python
from kubernetes import client, config

def scale_deployment_based_on_metrics(namespace, deployment_name, metrics):
    """Automatically scale a Kubernetes deployment based on metrics."""
    try:
        # Load Kubernetes configuration
        config.load_kube_config()
        apps_v1 = client.AppsV1Api()

        # Get current deployment
        deployment = apps_v1.read_namespaced_deployment(
            name=deployment_name,
            namespace=namespace
        )

        # Current replica count
        current_replicas = deployment.spec.replicas
        new_replicas = current_replicas  # Default to no change

        # Scale based on CPU utilization
        cpu_utilization = metrics.get('cpu_utilization', 0)
        if cpu_utilization > 80:
            new_replicas = min(current_replicas + 2, 10)  # Scale up, max 10 replicas
            print(f"Scaling up due to high CPU utilization ({cpu_utilization}%)")
        elif cpu_utilization < 30 and current_replicas > 1:
            new_replicas = max(current_replicas - 1, 1)  # Scale down, min 1 replica
            print(f"Scaling down due to low CPU utilization ({cpu_utilization}%)")

        # Update deployment if needed
        if new_replicas != current_replicas:
            deployment.spec.replicas = new_replicas
            apps_v1.patch_namespaced_deployment(
                name=deployment_name,
                namespace=namespace,
                body=deployment
            )
            print(f"Scaled deployment from {current_replicas} to {new_replicas} replicas")
        else:
            print(f"No scaling needed. Current replicas: {current_replicas}")

        return {
            'success': True,
            'previous_replicas': current_replicas,
            'new_replicas': new_replicas
        }

    except Exception as e:
        print(f"Error scaling deployment: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# Example usage
metrics = {'cpu_utilization': 85, 'memory_utilization': 60}
result = scale_deployment_based_on_metrics('production', 'web-app', metrics)
print(f"Autoscaling result: {result}")`;
}
