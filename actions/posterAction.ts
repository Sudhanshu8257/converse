// app/actions.ts
"use server";

export async function uploadToAnimeApi(formData: FormData) {
  try {
    const response = await fetch("http://localhost:4000/api/v1/poster/generate-anime", {
      method: "POST",
      body: formData,
      // Note: Do not set Content-Type header manually when using FormData; 
      // fetch sets it automatically with the boundary.
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Assuming the API returns { imageUrl: "..." }
    return { success: true, imageUrl: `http://localhost:4000${data.imageUrl}` };
    
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "Failed to process image" };
  }
}