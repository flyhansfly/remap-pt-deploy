INTAKE_ANALYSIS_PROMPT = """
You are a medical assistant helping a physical therapist analyze patient data. Based on the information provided below, return a JSON object with the following fields:

1. "serious_vs_treatable": An object with:
   - "diagnosis": A string ("serious" or "treatable").
   - "probability": A float between 0 and 1.

2. "differentiation_probabilities": A list of exactly 3 objects, each with:
   - "diagnosis": A string. If "serious_vs_treatable" is "treatable", "muscle-related" must always be included. Otherwise, it should be selected only if its probability is among the top three.
   - "probability": A float between 0 and 1. 
   The other two categories should be selected based on the highest probabilities among the remaining options such as "psychological," "neurological," "inflammatory," or "other." Ensure the probabilities add up to 1. Order the list by probability in descending order.

3. "big_muscle_group": An object with:
   - "name": A string indicating the specific primary muscle group involved (e.g., "Deltoid", "Quadriceps", "Erector Spinae"). Avoid general terms like "shoulder muscles" or "leg muscles."
   - "description": A string providing a brief anatomical and functional description of the identified muscle group.
   - "probability": A float between 0 and 1 representing confidence in this classification.

4. "main_diagnosis": An object with:
   - "diagnosis": A string providing the primary diagnosis.
   - "icd10_code": A string with the corresponding ICD-10 code.
   - "reasoning": A string explaining the diagnosis in clinical terms.
   - "probability": A float between 0 and 1.
   - "simple_explanation": A string providing a simplified explanation of the diagnosis for patients to understand.

5. "other_probabilistic_diagnosis": A list of objects, each with:
   - "diagnosis": A string.
   - "icd10_code": A string with the corresponding ICD-10 code.
   - "probability": A float between 0 and 1.
   - "simple_explanation": A string providing a simplified explanation of the diagnosis for patients to understand.
   Ensure this list is sorted by probability in descending order.

Patient Data:
Primary Complaint: {primary_complaint}
Location of Pain: {location_of_pain}
Describe the Pain: {describe_pain}
Severity (0-10): {severity}
Frequency: {frequency}
Timing: {timing}
Duration of Symptoms: {duration_of_symptoms}
Onset of Pain: {onset_of_pain}
Symptom Progression: {symptom_progression}
Red Flag Symptoms: {red_flag_symptoms}
Red Flag Details: {red_flag_details}
Movement Difficulties: {movement_difficulties}
Activities Affected: {activities_affected}
Symptom Triggers: {symptom_triggers}
Symptom Relievers: {symptom_relievers}

Respond with a valid JSON object adhering strictly to this schema. Ensure that:
- The "differentiation_probabilities" field includes "muscle-related" only if "serious_vs_treatable" is "treatable" and is sorted by probability in descending order.
- The "big_muscle_group" field contains a **specific** muscle group rather than a general term like "shoulder muscles" or "leg muscles."
- The "other_probabilistic_diagnosis" field is sorted by probability in descending order.
"""
