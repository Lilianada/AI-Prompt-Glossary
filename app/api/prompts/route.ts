import { NextResponse } from 'next/server';
import { getPrompts } from '@/lib/prompt-service';
import type { PromptCategory } from '@/types/prompt';
import { CATEGORIES } from '@/types/prompt';

/**
 * Validates if a category is valid
 */
function isValidCategory(category: string | null): boolean {
  if (!category) return true; // null/undefined is valid (no filter)
  return CATEGORIES.includes(category as PromptCategory);
}

/**
 * GET handler for fetching prompts with optional filtering
 */
export async function GET(request: Request) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || undefined;
    const categoryParam = searchParams.get('category');
    
    // Validate category if provided
    if (categoryParam && !isValidCategory(categoryParam)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }
    
    const category = categoryParam as PromptCategory | undefined;
    
    // Fetch prompts with filters
    const prompts = await getPrompts(searchTerm, category);
    
    // Return successful response with prompts
    return NextResponse.json({
      success: true,
      count: prompts.length,
      data: prompts
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching prompts:', error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch prompts',
        message: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
