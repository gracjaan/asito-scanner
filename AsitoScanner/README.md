# Asito Perception scan
## Introduction
The Asito Cleaning Inspection App is a powerful tool designed for managers in the cleaning industry. It allows users to take pictures of specific areas within a building or floor, analyze cleanliness, and retrieve essential details such as window presence, height, and other features through AI-powered API integration. At the end of the process, the app generates a detailed report, including the images taken and responses to key inspection questions.

## **Features**  
- 📸 **Capture Images** – Take pictures of specific areas for analysis.  
- 🧹 **Automated Analysis** – AI determines cleanliness, detects windows, and measures height.  
- 📊 **Real-time Feedback** – Instantly receive cleanliness assessments and area details.  
- 📝 **Comprehensive Reporting** – Generate structured reports with images and responses to key cleanliness questions.  

## **Downloading the App**  

The **Asito Perception scan** is available for mobile devices:  

### **Android Users**  
1. Open the **Google Play Store**  
2. Search for **"Asito Perception scan"**  
3. Tap **Install**  

### **iOS Users**  
1. Open the **Apple App Store**  
2. Search for **"Asito Perception scan"**  
3. Tap **Download**  

Once installed, log in with your **manager credentials** to start inspections.  

## **How to Use the App**  
### **1. Capturing Images**  
- Open the app and log in.  
- On the home screen, tap **"Start Scan"** to begin a new inspection.  

### **2. Select the Area for Inspection**  
- Choose the relevant areas from the list, such as:  
  - **Exterior**  
  - **Entrance**  
  - **Hall**  
  - **Restrooms**  
  - **Workspaces**  
  - **Dining Areas**  
  - **General Areas**  

### **3. Capture Images**  
- The app will prompt you to **take a picture** of the selected area.  
- Ensure the entire area is visible in the photo for accurate analysis.  
- Confirm the image before proceeding.  

### **4. Reviewing Images and Adding More**  
- After taking a picture, you can:  
  - ➕ **Add More Images** (if needed).  
  - ❌ **Delete an Image** before moving to the next step.  
  - ➡️ **Move to the Next Area** once satisfied with the images.
 
### **5. Answering Inspection Questions**  
- After taking photos, answer specific cleanliness-related questions such as:  
  - **Was the area cleaned properly?**  
  - **Are there any visible stains?**  
  - **Are windows clean and clear?**  
- These answers will be included in the final inspection report.  

### **6. Generating Reports**  
Once all areas are inspected, the app will automatically generate a **detailed report**, which includes:  
- 📷 **Captured Images**  
- 📝 **Answers to inspection questions**  
- 📊 **Overall cleanliness assessment**  
- 📍 **Date, time, and location of the inspection**  
- 📤 **Export or share the report** for record-keeping or follow-ups.  

---

## **Managing and Exporting Reports**  
- View past inspections under the **Reports** section.  
- Filter reports by **building, floor, date, or cleanliness status**.  
- **Export reports** in **PDF format** for documentation and compliance.  
- Share reports with cleaning teams or management.  

---

## **Best Practices for Accurate Inspections**  
- **Take well-lit, clear images** – Avoid blurry or dark photos.  
- **Capture the full area** – Ensure key elements (e.g., windows, floors, walls) are visible.  
- **Maintain a stable internet connection** – AI analysis requires connectivity.  
- **Update the app regularly** – Get the latest features and improvements.  

---
## **Troubleshooting**  
### **1. Images Not Analyzing?**  
- Make sure the camera is enabled in your **device settings**.  
- Ensure that the image is **clear** and has enough lighting.  
- Check your **internet connection**.  

### **2. Reports Not Generating?**  
- Make sure all required inspection steps are **completed**.  
- Restart the app and try again.  
- Contact **technical support** if the issue persists.  

---
## **How to Run the App Locally**

### **Prerequisites**
- Node.js (v14.0 or higher)
- npm or yarn package manager
- Git (for cloning the repository)

### **Installing Node.js and npm**

If you don't have Node.js installed on your system yet, follow these instructions:

#### **Windows Users**
1. **Download the installer**:
   - Visit the [official Node.js website](https://nodejs.org/)
   - Download the LTS version (recommended for most users)
   - Alternatively, you can follow [this video tutorial](https://www.youtube.com/watch?v=kQabFyl9r9I) for a visual guide

2. **Run the installer**:
   - Double-click the downloaded file
   - Follow the installation wizard instructions
   - Make sure to check the option to install npm

3. **Verify installation**:
   - Open Command Prompt
   - Run the following commands:
     ```bash
     node --version
     npm --version
     ```
   - Both commands should display version numbers if installation was successful

#### **macOS Users**
1. **Option 1: Using the installer**:
   - Visit [Node.js official website](https://nodejs.org/)
   - Download the LTS version
   - Run the installer and follow the instructions

2. **Option 2: Using Homebrew** (recommended):
   - Install Homebrew if you don't have it already:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Install Node.js:
     ```bash
     brew install node
     ```

3. **Verify installation**:
   - Open Terminal
   - Run:
     ```bash
     node --version
     npm --version
     ```

#### **Linux Users**
1. **Using package manager**:
   - For Ubuntu/Debian:
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```
   - For Fedora:
     ```bash
     sudo dnf install nodejs
     ```

2. **Verify installation**:
   - Open Terminal
   - Run:
     ```bash
     node --version
     npm --version
     ```

### **Setting Up the Development Environment**
1. **Clone the repository**
   ```bash
   git clone https://github.com/gracjaan/asito-scanner.git
   cd asito-scanner/AsitoScanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   - Create a `.expo-env.d.ts` file in the root directory
   - Add the following variables:
     ```
     OPENAI_API_KEY=https://api.example.com
     RESEND_API_KEY=your_api_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the app**
   - For mobile testing, use the Expo app (download it from App Store or Google Play) and scan the QR code displayed in the terminal
