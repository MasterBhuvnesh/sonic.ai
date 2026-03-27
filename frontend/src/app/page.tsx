import AudioGenerator from '@/components/AudioGenerator';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#6633cc] via-[#dc81e8] to-[#fce4ec]">
      
      {/* Decorative background blur blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#5922e6]/50 rounded-full blur-[140px]" />
         <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-[#ffb3d9]/60 rounded-full blur-[120px]" />
      </div>

      <div className="w-full relative z-10 flex flex-col items-center">
         <AudioGenerator />
      </div>
      
    </main>
  );
}
