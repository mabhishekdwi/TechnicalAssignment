// Type definitions for test data structure

export interface Viewport {
  width: number;
  height: number;
}

export interface WidgetLoadingTest {
  id: string;
  device: string;
  viewport: Viewport;
  description: string;
  expected_elements: string[];
}

export interface UIInteractionTest {
  id: string;
  action: string;
  prompt: string;
  description: string;
  validate: string[];
  key?: string;
}

export interface ResponseRenderingTest {
  id: string;
  prompt: string;
  description: string;
  expected_type: string;
  validate: string[];
}

export interface MultilingualTest {
  id: string;
  language: string;
  prompt: string;
  description: string;
  expected_direction: string;
  validate: string[];
}

export interface ChatbotUIBehavior {
  description: string;
  widget_loading: WidgetLoadingTest[];
  ui_interactions: UIInteractionTest[];
  response_rendering: ResponseRenderingTest[];
  multilingual_support: MultilingualTest[];
}

export interface ResponseQualityTest {
  id: string;
  prompt: string;
  language: string;
  description: string;
  expected_keywords: string[];
  min_length: number;
}

export interface HallucinationTest {
  id: string;
  prompt: string;
  description: string;
  check_for: string[];
  should_not_contain: string[];
}

export interface GPTResponseValidation {
  description: string;
  response_quality: ResponseQualityTest[];
  hallucination_detection: HallucinationTest[];
}

export interface XSSTest {
  id: string;
  payload: string;
  description: string;
  expected_behavior: string;
}

export interface PromptInjectionTest {
  id: string;
  payload: string;
  description: string;
  expected_behavior: string;
}

export interface EdgeCaseTest {
  id: string;
  input: string;
  description: string;
  expected_behavior: string;
}

export interface SecurityInjectionHandling {
  description: string;
  xss_prevention: XSSTest[];
  prompt_injection: PromptInjectionTest[];
  edge_cases: EdgeCaseTest[];
}

export interface TestData {
  A_chatbot_ui_behavior?: ChatbotUIBehavior;
  B_gpt_response_validation?: GPTResponseValidation;
  C_security_injection_handling?: SecurityInjectionHandling;
}
