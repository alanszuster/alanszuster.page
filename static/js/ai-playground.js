// AI Playground functionality
class AIPlayground {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.apiUrl = '/api/ai'; // Use our proxy endpoints
        this.totalClasses = 0; // Store total number of classes

        this.initCanvas();
        this.bindEvents();
        this.loadClassesInfo(); // Load classes info on initialization
    }

    initCanvas() {
        // Set up canvas for drawing
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        // Fill canvas with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
        this.canvas.addEventListener('touchmove', (e) => this.draw(e));
        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        // Button events
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('predictDrawing').addEventListener('click', () => this.predictDrawing());
        document.getElementById('randomWord').addEventListener('click', () => this.getRandomWord());
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }

    startDrawing(e) {
        e.preventDefault();
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    draw(e) {
        if (!this.isDrawing) return;
        e.preventDefault();

        const coords = this.getCoordinates(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();

        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hideResults();
        this.hideError();
    }

    async predictDrawing() {
        try {
            this.showLoading();
            this.hideResults();
            this.hideError();

            // Convert canvas to base64
            const imageData = this.canvas.toDataURL('image/png');

            // Send to AI API
            const response = await fetch(`${this.apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.predictions) {
                this.showResults(result.predictions);
            } else {
                throw new Error(result.error || 'Unknown error occurred');
            }

        } catch (error) {
            console.error('Prediction error:', error);
            this.showError(`Failed to predict drawing: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async getRandomWord() {
        try {
            const response = await fetch(`${this.apiUrl}/random-word`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.word) {
                this.showChallenge(result.word);
            } else {
                throw new Error(result.error || 'Failed to get random word');
            }

        } catch (error) {
            console.error('Random word error:', error);
            this.showError(`Failed to get random word: ${error.message}`);
        }
    }

    async loadClassesInfo() {
        try {
            const response = await fetch(`${this.apiUrl}/classes`);
            const result = await response.json();

            if (response.ok && result.classes) {
                this.totalClasses = result.total_classes;
                this.updateClassesDisplay();
                console.log(`AI model can recognize ${this.totalClasses} different classes:`, result.classes);
            } else {
                console.warn('Could not load classes info:', result.error);
                this.showClassesError();
            }

        } catch (error) {
            console.error('Error loading classes info:', error);
            this.showClassesError();
        }
    }

    updateClassesDisplay() {
        const classesInfo = document.getElementById('classesInfo');
        if (classesInfo && this.totalClasses > 0) {
            classesInfo.innerHTML = `<i class="fas fa-robot text-primary"></i> The AI can recognize <strong>${this.totalClasses}</strong> different drawings`;
            classesInfo.className = 'alert alert-success mb-3';
            classesInfo.style.display = 'block';
        }
    }

    showClassesError() {
        const classesInfo = document.getElementById('classesInfo');
        if (classesInfo) {
            classesInfo.innerHTML = `<i class="fas fa-exclamation-triangle text-warning"></i> AI service is currently unavailable`;
            classesInfo.className = 'alert alert-warning mb-3';
            classesInfo.style.display = 'block';
        }
    }

    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showResults(predictions) {
        const resultsContainer = document.getElementById('predictionResults');
        const predictionsList = document.getElementById('predictionsList');

        predictionsList.innerHTML = '';

        // Sort predictions by confidence
        predictions.sort((a, b) => b.confidence - a.confidence);

        // Display top 5 predictions
        predictions.slice(0, 5).forEach((prediction, index) => {
            const percentage = (prediction.confidence * 100).toFixed(1);
            const progressBarClass = index === 0 ? 'bg-success' : 'bg-primary';

            const predictionDiv = document.createElement('div');
            predictionDiv.className = 'mb-3';
            predictionDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-bold">${prediction.class}</span>
                    <span class="text-muted">${percentage}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar ${progressBarClass}"
                         style="width: ${percentage}%"></div>
                </div>
            `;

            predictionsList.appendChild(predictionDiv);
        });

        resultsContainer.style.display = 'block';
    }

    showChallenge(word) {
        document.getElementById('wordToTraw').textContent = word;
        document.getElementById('challengeWord').style.display = 'block';
        this.clearCanvas();
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorDisplay').style.display = 'block';
    }

    hideResults() {
        document.getElementById('predictionResults').style.display = 'none';
    }

    hideError() {
        document.getElementById('errorDisplay').style.display = 'none';
    }
}

// Initialize AI Playground when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('drawingCanvas')) {
        new AIPlayground();
    }
});
