from app import app
import os

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=65500)

if __name__ == '__main__':
    # Run the app with the specified port
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)