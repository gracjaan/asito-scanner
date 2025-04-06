import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Report {
  id: string;
  scope: string;
  date: string;
  dateTime?: string;
  status: string;
  userName: string;
  description: string;
  questions: {
    id: string;
    text: string;
    displayText: string;
    analyticalQuestion: string;
    answer?: string;
    images: string[];
    completed: boolean;
  }[];
}

const STORAGE_KEY = 'asito_reports';

/**
 * Save a new report to AsyncStorage
 */
export const saveReport = async (report: Report): Promise<void> => {
  try {
    // Get existing reports
    const existingReportsJson = await AsyncStorage.getItem(STORAGE_KEY);
    const existingReports: Report[] = existingReportsJson ? JSON.parse(existingReportsJson) : [];
    
    // Add new report
    existingReports.push(report);
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingReports));
    
    console.log('Report saved successfully:', report.id);
  } catch (error) {
    console.error('Error saving report:', error);
    throw error;
  }
};

/**
 * Get all reports from AsyncStorage
 */
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const reportsJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!reportsJson) return [];
    
    return JSON.parse(reportsJson);
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
};

/**
 * Get a specific report by ID
 */
export const getReportById = async (reportId: string): Promise<Report | null> => {
  try {
    const reports = await getAllReports();
    return reports.find(report => report.id === reportId) || null;
  } catch (error) {
    console.error('Error getting report by ID:', error);
    return null;
  }
};

/**
 * Delete a report by ID
 */
export const deleteReport = async (reportId: string): Promise<boolean> => {
  try {
    const reports = await getAllReports();
    const filteredReports = reports.filter(report => report.id !== reportId);
    
    if (reports.length === filteredReports.length) {
      // Report not found
      return false;
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReports));
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
};