import React, { useRef } from "react";
import styled from "@emotion/styled";
import {
  motion,
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

const dampen = 40;

const CardWrapper = styled(motion.div)`
  width: 500px;
  height: 700px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px) brightness(1.2);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  overflow: hidden;
  position: relative;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const DotGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 1px,
    transparent 0
  );
  transform: translateZ(-500px);
`;

const ShinyEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: absolute;
`;

const GIFImage = styled.img`
  margin-top: 30px;
  width: 90%;
  height: 40%;
  margin-bottom: 10px;
  border-radius: 15px;
`;

const TextContent = styled.div`
  width: 90%;
  text-align: left;
  padding-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MessageText = styled.p`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 10px;
`;

const AuthorText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
`;

const MessageCounter = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  position: absolute;
  bottom: 10px;
  right: 20px;
`;

const FinalCard: React.FC<{
  gifUrl?: string;
  text?: string;
  author?: string;
  image?: string;
  isCoverSlide: boolean;
  currentMessageIndex?: number;
  totalMessages?: number;
}> = ({
  gifUrl,
  text,
  author,
  image,
  isCoverSlide,
  currentMessageIndex = 1,
  totalMessages = 1,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);
  const rotateX = useTransform(mouseY, (newMouseY) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return -((newMouseY - rect.top - rect.height / 2) / dampen);
  });
  
  const rotateY = useTransform(mouseX, (newMouseX) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return (newMouseX - rect.left - rect.width / 2) / dampen;
  });
  
  // Create a custom diagonalMotionValue
  const diagonalMotionValue = motionValue(0);
  
  // Sync rotateX and rotateY changes to the diagonalMotionValue
  useMotionValueEvent(rotateX, "change", (x) => {
    const y = rotateY.get(); // Get the current value of rotateY
    diagonalMotionValue.set(x + y); // Set the combined value
  });
  
  useMotionValueEvent(rotateY, "change", (y) => {
    const x = rotateX.get(); // Get the current value of rotateX
    diagonalMotionValue.set(x + y); // Set the combined value
  });
  
  // Use the diagonalMotionValue in transforms
  const sheenPosition = useTransform(diagonalMotionValue, [-5, 5], [-100, 200]);
  const sheenOpacity = useTransform(
    sheenPosition,
    [-100, 50, 200],
    [0, 0.1, 0]
  );
  const sheenGradient = useMotionTemplate`linear-gradient(55deg, transparent, rgba(255, 255, 255, ${sheenOpacity}) ${sheenPosition}%, transparent)`;
  

  return (
    <CardWrapper
      ref={cardRef}
      style={{ rotateX, rotateY }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      <DotGrid />
      <ShinyEffect style={{ backgroundImage: sheenGradient }} />
      <CardContent>
        {isCoverSlide ? (
          <CoverImage style={{ backgroundImage: `url(${image})` }} />
        ) : gifUrl ? (
          <GIFImage src={gifUrl} alt="GIF" />
        ) : null}
        <TextContent>
          <MessageText>{text}</MessageText>
          <div>
            <AuthorText>{author}</AuthorText>
            <MessageCounter>
              {currentMessageIndex} / {totalMessages}
            </MessageCounter>
          </div>
        </TextContent>
      </CardContent>
    </CardWrapper>
  );
};

export default FinalCard;
