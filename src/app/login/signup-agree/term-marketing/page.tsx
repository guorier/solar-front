'use client';

import { styled } from 'styled-components';

const TermsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  height: 474px;
  padding: var(--spacing-10);
  border-radius: var(--radius-sm);
  background: var(--gray-5);
  overflow-y: auto;
  color: var(--text-color);

  h3 {
    font-size: var(--font-size);
    font-weight; 700;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);

    h5 {
      font-size: var(--font-size);
    }
      
    ul {
      li {
        + li {
          margin-top: var(--spacing-4);
        }
      }
    }
  }
`;

export default function TermMarketingPage() {
  return (
    <TermsBox>
      <h3>[주식회사 와이어블] 광고성 정보 수신 동의 이용약관</h3>

      <section>
        <h4>제1장 총칙</h4>

        <article>
          <h5>제1조 (목적)</h5>
          <p>
            내용은 채워질 예정
          </p>
        </article>
      </section>
    </TermsBox>
  );
}
