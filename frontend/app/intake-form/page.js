"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { intakeAnalysisResultAtom } from "../atoms/intakeAnalysisResultAtom";
import { intakeDataAtom } from "../atoms/intakeDataAtom";

const IntakeFormPage = () => {
	const defaultValues = {
		primary_complaint: "Mild shoulder pain",
		location_of_pain: ["Shoulder"],
		describe_pain: ["Aching"],
		severity: 3, // Lower severity for "treatable"
		frequency: "Intermittent",
		timing: ["During physical activity"],
		duration_of_symptoms: "1-4 weeks", // Shorter duration for treatable conditions
		onset_of_pain: "Gradually over time",
		symptom_progression: "Improved", // Indicate improvement
		red_flag_symptoms: [], // No red flags for treatable
		red_flag_details: "",
		movement_difficulties: ["Lifting objects"],
		activities_affected: ["Working", "Recreational activities"],
		symptom_triggers: ["Physical activity"],
		symptom_relievers: ["Rest", "Stretching", "Massage"],
	};

	const { register, handleSubmit } = useForm({ defaultValues });
	const [isLoading, setIsLoading] = useState(false);
	const [analysisResult, setAnalysisResult] = useAtom(intakeAnalysisResultAtom);
	const router = useRouter();
	const [intakeData, setIntakeData] = useAtom(intakeDataAtom);
	const onSubmit = async (data) => {
		setIsLoading(true);
		console.log(data);
		setIntakeData(data);
		try {
			// Send data to the API endpoint
			const response = await fetch(
				"http://localhost:8000/api/intake_analysis/",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			console.log(response);

			if (!response.ok) {
				throw new Error("Failed to analyze the intake form data");
			}

			const result = await response.json();

			// Validate response structure
			if (
				result.serious_vs_treatable &&
				result.differentiation_probabilities &&
				result.main_diagnosis &&
				result.other_probabilistic_diagnosis
			) {
				// Store the result in Recoil and navigate to the results page
				setAnalysisResult(result);
				router.push("/intake-analysis-result");
			} else {
				throw new Error("Unexpected response format from the server");
			}
		} catch (error) {
			console.error("Error submitting the form:", error);
			alert("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function to render checkbox groups
	const renderCheckboxGroup = (name, options) => (
		<div className="flex flex-wrap gap-4 mt-2">
			{options.map((option, index) => (
				<label key={index} className="flex items-center space-x-2">
					<input
						type="checkbox"
						value={option}
						{...register(name)}
						className="h-4 w-4 border-gray-300 rounded focus:ring focus:ring-blue-300"
					/>
					<span>{option}</span>
				</label>
			))}
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto px-6 py-8 bg-gray-100 rounded-lg shadow-lg">
			<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
				Medical Assistant Intake Form
			</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Primary Complaint */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Primary Complaint:
					</label>
					<input
						type="text"
						{...register("primary_complaint", { required: true })}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</div>

				{/* Location of Pain */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Location of Pain (Check all that apply):
					</label>
					{renderCheckboxGroup("location_of_pain", [
						"Neck",
						"Shoulder",
						"Upper back",
						"Lower back",
						"Hip",
						"Knee",
						"Ankle",
						"Foot",
						"Other",
					])}
				</div>

				{/* Nature of Pain */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Nature of Pain (Check all that apply):
					</label>
					{renderCheckboxGroup("describe_pain", [
						"Sharp",
						"Dull",
						"Throbbing",
						"Burning",
						"Aching",
						"Stabbing",
						"Radiating",
						"Tingling",
						"Numbness",
					])}
				</div>

				{/* Severity */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Severity (0-10):
					</label>
					<input
						type="number"
						min="0"
						max="10"
						{...register("severity", { required: true })}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</div>

				{/* Frequency */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Frequency:
					</label>
					<select
						{...register("frequency")}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					>
						<option value="Constant">Constant</option>
						<option value="Intermittent">Intermittent</option>
					</select>
				</div>

				{/* Timing */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Timing (Check all that apply):
					</label>
					{renderCheckboxGroup("timing", [
						"Morning",
						"Afternoon",
						"Evening",
						"Night",
						"During physical activity",
						"At rest",
					])}
				</div>

				{/* Duration of Symptoms */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Duration of Symptoms:
					</label>
					<select
						{...register("duration_of_symptoms")}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					>
						<option value="Less than 1 week">Less than 1 week</option>
						<option value="1-4 weeks">1-4 weeks</option>
						<option value="1-3 months">1-3 months</option>
						<option value="Over 3 months">Over 3 months</option>
					</select>
				</div>

				{/* Onset of Pain */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Onset of Pain:
					</label>
					<select
						{...register("onset_of_pain")}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					>
						<option value="Suddenly (e.g., injury or accident)">
							Suddenly (e.g., injury or accident)
						</option>
						<option value="Gradually over time">Gradually over time</option>
						<option value="After surgery">After surgery</option>
						<option value="Other">Other</option>
					</select>
				</div>

				{/* Symptom Progression */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Symptom Progression:
					</label>
					<select
						{...register("symptom_progression")}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					>
						<option value="Gotten worse">Gotten worse</option>
						<option value="Stayed the same">Stayed the same</option>
						<option value="Improved">Improved</option>
					</select>
				</div>

				{/* Red Flag Symptoms */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Serious Symptoms (Check all that apply):
					</label>
					{renderCheckboxGroup("red_flag_symptoms", [
						"Unexplained weight loss",
						"Bowel or bladder control issues",
						"Numbness spreading to other areas",
						"Severe weakness in the legs",
						"Fever or chills",
						"Night sweats",
						"Recent infection",
					])}
				</div>

				{/* Details */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Details (Optional):
					</label>
					<input
						type="text"
						{...register("red_flag_details")}
						className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
					/>
				</div>

				{/* Movement Difficulties */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Movement Difficulties (Check all that apply):
					</label>
					{renderCheckboxGroup("movement_difficulties", [
						"Bending forward (flexion)",
						"Bending backward (extension)",
						"Twisting (rotation)",
						"Side bending",
						"Reaching overhead",
						"Lifting objects",
						"No difficulty",
					])}
				</div>

				{/* Activities Affected */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Activities Affected (Check all that apply):
					</label>
					{renderCheckboxGroup("activities_affected", [
						"Dressing",
						"Bathing",
						"Cooking",
						"Cleaning",
						"Driving",
						"Working",
						"Sleeping",
						"Recreational activities",
						"Childcare",
						"Other",
					])}
				</div>

				{/* Symptom Triggers */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Symptom Triggers (Check all that apply):
					</label>
					{renderCheckboxGroup("symptom_triggers", [
						"Sitting",
						"Standing",
						"Walking",
						"Lifting",
						"Bending",
						"Driving",
						"Physical activity",
						"Stress",
						"Weather changes",
						"Other",
					])}
				</div>

				{/* Symptom Relievers */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Symptom Relievers (Check all that apply):
					</label>
					{renderCheckboxGroup("symptom_relievers", [
						"Rest",
						"Heat",
						"Cold",
						"Medication",
						"Stretching",
						"Massage",
						"Physical therapy",
						"Changing positions",
						"Exercise",
						"Other",
					])}
				</div>

				{/* Submit Button */}

				<div>
					{isLoading ? (
						<div className="text-lg font-semibold">Loading Result...</div>
					) : (
						<button
							type="submit"
							className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
						>
							Submit
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default IntakeFormPage;
