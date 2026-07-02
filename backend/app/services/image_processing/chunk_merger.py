from typing import List, Dict, Any

class ChunkMerger:
    @staticmethod
    def merge(parsed_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Merges parsed JSON results from multiple chunks into one unified structure.
        - Merges sections with the same name.
        - Merges subjects within sections.
        - Removes duplicates.
        - Preserves ordering.
        """
        merged_sections_map = {}
        ordered_section_names = []

        for chunk in parsed_chunks:
            sections = chunk.get("sections", [])
            for section_data in sections:
                section_name = section_data.get("section")
                if not section_name:
                    continue
                
                # If section not seen before, initialize it
                if section_name not in merged_sections_map:
                    merged_sections_map[section_name] = {
                        "section": section_name,
                        "subjects": []
                    }
                    ordered_section_names.append(section_name)
                
                # Merge subjects
                existing_subjects = merged_sections_map[section_name]["subjects"]
                new_subjects = section_data.get("subjects", [])
                
                for subject in new_subjects:
                    # Simple deduplication based on exact dictionary match
                    if subject not in existing_subjects:
                        existing_subjects.append(subject)

        # Reconstruct the final list of sections preserving original order
        final_sections = [merged_sections_map[name] for name in ordered_section_names]
        
        return {"sections": final_sections}
