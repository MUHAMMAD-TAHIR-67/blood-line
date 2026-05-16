// components/BMICalculator.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function BMICalculator({ onEligibilityChange }) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [healthIssues, setHealthIssues] = useState([]);
  const [medications, setMedications] = useState([]);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDetails, setEligibilityDetails] = useState([]);

  const healthIssuesList = [
    'Diabetes', 'High Blood Pressure', 'Heart Disease', 
    'Hepatitis', 'HIV/AIDS', 'Malaria', 'Tuberculosis',
    'Thyroid Disorder', 'Anemia', 'Epilepsy', 'Cancer'
  ];

  const medicationsList = [
    'Blood Thinners', 'Antibiotics', 'Steroids', 
    'Insulin', 'Chemotherapy', 'Immunosuppressants'
  ];

  useEffect(() => {
    if (weight && height && age) {
      calculateBMI();
      checkEligibility();
    }
  }, [weight, height, age, healthIssues, medications]);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));
    
    if (bmiValue < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiCategory('Normal');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  };

  const checkEligibility = () => {
    const details = [];
    let eligible = true;

    if (age < 18) {
      details.push('Age must be at least 18 years');
      eligible = false;
    } else if (age > 65) {
      details.push('Age above 65 - Please consult doctor');
      eligible = false;
    } else {
      details.push('Age is within eligible range (18-65 years)');
    }

    // Weight Check (minimum 50kg)
    if (weight < 50) {
      details.push('Weight must be at least 50 kg');
      eligible = false;
    } else {
      details.push('Weight meets minimum requirement (≥50 kg)');
    }

    // BMI Check
    if (bmi) {
      if (bmi < 18.5) {
        details.push('Underweight - May need medical clearance');
      } else if (bmi >= 18.5 && bmi < 25) {
        details.push('BMI is in healthy range');
      } else if (bmi >= 25 && bmi < 30) {
        details.push('Overweight - Generally eligible');
      } else {
        details.push('Obese - May need doctor approval');
        eligible = false;
      }
    }

    // Health Issues Check
    if (healthIssues.length > 0) {
      details.push(`Has health conditions: ${healthIssues.join(', ')} - Requires doctor consultation`);
    } else {
      details.push('No major health conditions');
    }

    // Medications Check
    if (medications.length > 0) {
      details.push(`Taking medications: ${medications.join(', ')} - May affect eligibility`);
    } else {
      details.push('No conflicting medications');
    }

    setEligibilityDetails(details);
    setIsEligible(eligible && healthIssues.length === 0 && medications.length === 0);
    
    if (onEligibilityChange) {
      onEligibilityChange({ eligible, details, bmi, bmiCategory });
    }
  };

  const handleHealthIssueToggle = (issue) => {
    setHealthIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const handleMedicationToggle = (med) => {
    setMedications(prev =>
      prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
    );
  };

  const getBMIColor = () => {
    if (!bmi) return 'text-gray-500';
    if (bmi < 18.5) return 'text-orange-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className='bg-white rounded-xl shadow-md border p-6 space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-gray-800 mb-2'>Donor Eligibility Checker</h3>
        <p className='text-sm text-gray-500'>Check if you're eligible to donate blood based on health parameters</p>
      </div>

      {/* Input Fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Age (years) *</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
            placeholder="18-65"
            min="18"
            max="65"
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Weight (kg) *</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
            placeholder="Minimum 50 kg"
            min="50"
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Height (cm) *</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500'
            placeholder="e.g., 170"
            min="100"
            max="250"
          />
        </div>
      </div>

      {/* BMI Display */}
      {bmi && (
        <div className='bg-gray-50 rounded-lg p-4 text-center'>
          <p className='text-sm text-gray-500'>Your BMI</p>
          <p className={`text-3xl font-bold ${getBMIColor()}`}>{bmi}</p>
          <p className={`text-sm font-medium ${getBMIColor()}`}>{bmiCategory}</p>
          <p className='text-xs text-gray-400 mt-1'>
            Normal BMI: 18.5 - 24.9
          </p>
        </div>
      )}

      
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Health Conditions (Select if any)</label>
        <div className='flex flex-wrap gap-2'>
          {healthIssuesList.map(issue => (
            <button
              key={issue}
              type="button"
              onClick={() => handleHealthIssueToggle(issue)}
              className={`px-3 py-1 rounded-full text-xs transition ${
                healthIssues.includes(issue)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Medications (Select if any)</label>
        <div className='flex flex-wrap gap-2'>
          {medicationsList.map(med => (
            <button
              key={med}
              type="button"
              onClick={() => handleMedicationToggle(med)}
              className={`px-3 py-1 rounded-full text-xs transition ${
                medications.includes(med)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {med}
            </button>
          ))}
        </div>
      </div>

      {age && weight && height && (
        <div className={`rounded-lg p-4 ${isEligible ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xl'>{isEligible ? '✅' : '⚠️'}</span>
            <p className={`font-semibold ${isEligible ? 'text-green-700' : 'text-yellow-700'}`}>
              {isEligible ? 'You are eligible to donate blood!' : 'You may need to consult a doctor before donating'}
            </p>
          </div>
          <ul className='text-sm space-y-1'>
            {eligibilityDetails.map((detail, idx) => (
              <li key={idx} className={detail.includes('✅') ? 'text-green-600' : detail.includes('❌') ? 'text-red-600' : 'text-yellow-600'}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='bg-blue-50 rounded-lg p-4'>
        <p className='font-semibold text-blue-800 mb-2'> Before Donating Blood:</p>
        <ul className='text-sm text-blue-700 space-y-1'>
          <li>• Get a good night's sleep (7-8 hours)</li>
          <li>• Eat a healthy meal 2-3 hours before donation</li>
          <li>• Drink plenty of water</li>
          <li>• Avoid fatty foods before donation</li>
          <li>• Inform staff about any medications</li>
        </ul>
      </div>
    </div>
  );
}