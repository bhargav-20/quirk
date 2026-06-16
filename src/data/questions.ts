import type { Question } from '../types'

// All questions are original, Claude-generated statements written for Quirk.
// They are NOT taken from the official MBTI® instrument. See data/disclaimer.ts.
//
// Likert framing: the user rates agreement 1 (strongly disagree) … 5 (strongly agree).
// `agreePole` is the pole a strong-agree answer leans toward.

export const QUESTIONS: Question[] = [
  // ── Energy: Extraversion (E) ↔ Introversion (I) ─────────────────────────
  { id: 1, axis: 'EI', agreePole: 'E', text: 'A big, loud party leaves me buzzing with energy rather than drained.' },
  { id: 2, axis: 'EI', agreePole: 'I', text: 'After lots of socializing, I need quiet alone time to recharge.' },
  { id: 3, axis: 'EI', agreePole: 'E', text: 'I think out loud — talking things through helps me figure them out.' },
  { id: 4, axis: 'EI', agreePole: 'I', text: 'I prefer one deep conversation over a room full of small talk.' },
  { id: 5, axis: 'EI', agreePole: 'E', text: 'Meeting brand-new people feels exciting, not exhausting.' },
  { id: 6, axis: 'EI', agreePole: 'I', text: 'My best ideas tend to arrive when I am alone with my thoughts.' },
  { id: 7, axis: 'EI', agreePole: 'E', text: 'I am usually the one who strikes up conversations with strangers.' },
  { id: 8, axis: 'EI', agreePole: 'I', text: 'My ideal Friday after a long week is a quiet night in.' },
  { id: 9, axis: 'EI', agreePole: 'E', text: 'Being surrounded by lots of people genuinely lights me up.' },
  { id: 10, axis: 'EI', agreePole: 'I', text: 'When my phone rings unexpectedly, I would rather it were a text.' },

  // ── Information: Sensing (S) ↔ Intuition (N) ────────────────────────────
  { id: 11, axis: 'SN', agreePole: 'S', text: 'I trust concrete facts and evidence more than gut hunches.' },
  { id: 12, axis: 'SN', agreePole: 'N', text: 'I often catch myself daydreaming about future possibilities.' },
  { id: 13, axis: 'SN', agreePole: 'S', text: 'I notice small, practical details that other people miss.' },
  { id: 14, axis: 'SN', agreePole: 'N', text: 'I am drawn to big-picture patterns and what things could become.' },
  { id: 15, axis: 'SN', agreePole: 'S', text: 'I would rather have clear step-by-step instructions than a vague vision.' },
  { id: 16, axis: 'SN', agreePole: 'N', text: 'I enjoy abstract ideas and theories even with no immediate use.' },
  { id: 17, axis: 'SN', agreePole: 'S', text: 'I focus on what is real and happening right now.' },
  { id: 18, axis: 'SN', agreePole: 'N', text: 'I instinctively read between the lines for hidden meanings.' },
  { id: 19, axis: 'SN', agreePole: 'S', text: 'I trust proven methods over untested experiments.' },
  { id: 20, axis: 'SN', agreePole: 'N', text: 'I love getting lost in "what if?" scenarios.' },

  // ── Decisions: Thinking (T) ↔ Feeling (F) ───────────────────────────────
  { id: 21, axis: 'TF', agreePole: 'T', text: 'When I decide something, logic matters more to me than feelings.' },
  { id: 22, axis: 'TF', agreePole: 'F', text: 'I instinctively weigh how a choice will affect people emotionally.' },
  { id: 23, axis: 'TF', agreePole: 'T', text: 'If I must choose, I would rather be honest than tactful.' },
  { id: 24, axis: 'TF', agreePole: 'F', text: 'I work hard to keep harmony in a group.' },
  { id: 25, axis: 'TF', agreePole: 'T', text: 'I can argue a point coolly without taking it personally.' },
  { id: 26, axis: 'TF', agreePole: 'F', text: 'I feel other people’s emotions almost as if they were my own.' },
  { id: 27, axis: 'TF', agreePole: 'T', text: 'I value fair, consistent rules over case-by-case sympathy.' },
  { id: 28, axis: 'TF', agreePole: 'F', text: 'Being kind matters more to me than being right.' },
  { id: 29, axis: 'TF', agreePole: 'T', text: 'I am comfortable giving blunt, critical feedback when it is deserved.' },
  { id: 30, axis: 'TF', agreePole: 'F', text: 'I often put other people’s needs ahead of my own.' },

  // ── Lifestyle: Judging (J) ↔ Perceiving (P) ─────────────────────────────
  { id: 31, axis: 'JP', agreePole: 'J', text: 'I love making lists and ticking things off.' },
  { id: 32, axis: 'JP', agreePole: 'P', text: 'I like to keep my options open rather than commit early.' },
  { id: 33, axis: 'JP', agreePole: 'J', text: 'A planned schedule makes me feel calm and in control.' },
  { id: 34, axis: 'JP', agreePole: 'P', text: 'I do my best work in a last-minute burst near the deadline.' },
  { id: 35, axis: 'JP', agreePole: 'J', text: 'I like having things decided and settled.' },
  { id: 36, axis: 'JP', agreePole: 'P', text: 'Spontaneous plans excite me more than fixed ones.' },
  { id: 37, axis: 'JP', agreePole: 'J', text: 'Messy, open-ended situations tend to stress me out.' },
  { id: 38, axis: 'JP', agreePole: 'P', text: 'I adapt easily when plans change at the last minute.' },
  { id: 39, axis: 'JP', agreePole: 'J', text: 'I usually finish tasks well before they are due.' },
  { id: 40, axis: 'JP', agreePole: 'P', text: 'I would rather explore freely than follow a strict routine.' },
]

export const QUESTIONS_PER_AXIS = 10
