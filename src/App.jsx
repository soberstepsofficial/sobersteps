import React, { useState , useEffect } from 'react'
import logo from './assets/sobersteps_logo_no_background.png'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Smile, CheckCircle, Users, Home, Gamepad2, BookOpen, Info, HelpCircle, Menu, X, Play, Award, Target, Heart, ArrowRight, RotateCcw, Star, TrendingUp, ExternalLink } from 'lucide-react'

//score, games completed, achievements, and currentstreak tracking
function useGameState() {
  const [userProgress, setUserProgress] = useState({
    gamesCompleted: 0,
    totalScore: 0,
    achievements: [],
    currentStreak: 0
  })

  const updateProgress = (gameId, score, completed = false) => {
    setUserProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      gamesCompleted: completed ? prev.gamesCompleted + 1 : prev.gamesCompleted,
      currentStreak: completed ? prev.currentStreak + 1 : prev.currentStreak
    }))
  }

  return { userProgress, updateProgress }
}

// Decision Game components 
function DecisionGame({ onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

const scenarios = [
  {
    id: 1,
    situation: "You're at a party and someone offers you a drink that you suspect contains alcohol. Your friends are watching.",
    choices: [
      { 
        text: "Take the drink to fit in", 
        points: 0, 
        feedback: "It might seem easier to go along, but that can lead to bigger regrets later. Real friends don’t need you to prove anything.",
        consequence: "You feel uneasy after and realize it wasn’t worth it."
      },
      { 
        text: "Politely decline and grab a soda instead", 
        points: 10, 
        feedback: "Nice call — staying calm and confident makes your boundaries clear.",
        consequence: "Your friends respect your choice and some even follow your lead."
      },
      { 
        text: "Walk away without saying anything", 
        points: 5, 
        feedback: "That avoids the moment, but standing up for yourself helps more long term.",
        consequence: "You leave but still feel unsure about how to handle it next time."
      }
    ]
  },
  {
    id: 2,
    situation: "A friend seems stressed about school and mentions they’ve been thinking about trying substances to cope. They ask for your advice.",
    choices: [
      { text: "Tell them to do what makes them feel better", points: 0, feedback: "That might sound supportive, but it can cause serious harm. Your friend needs real help.", consequence: "Their stress worsens and you feel guilty for not saying more." },
      { text: "Suggest they talk to a counselor or coach", points: 10, feedback: "You nailed it — guiding them to support shows real friendship.", consequence: "They open up to an adult and start feeling better." },
      { text: "Change the topic to avoid the awkwardness", points: 2, feedback: "Avoiding it might feel easier, but silence can make them feel alone.", consequence: "They don’t bring it up again and you worry later." }
    ]
  },
  {
    id: 3,
    situation: "You see posts on social media of classmates using substances and looking like they’re having a great time.",
    choices: [
      { text: "Ask if you can join next time", points: 0, feedback: "Social media doesn’t show the downsides — it’s a highlight reel.", consequence: "You realize the fun was fake when things go wrong for them later." },
      { text: "Focus on friends who share your values", points: 10, feedback: "Exactly! Finding your kind of people pays off.", consequence: "You feel happier and more confident in your own choices." },
      { text: "Scroll away but feel bad about yourself", points: 3, feedback: "Everyone feels left out sometimes — reach out to friends who lift you up.", consequence: "You stay stuck comparing yourself to others online." }
    ]
  },
  {
    id: 4,
    situation: "Your teammate asks you to skip practice to hang out, even though your coach warned that missing another session means you’ll be benched.",
    choices: [
      { text: "Skip practice, you’ll deal with the consequences later", points: 0, feedback: "Quick fun can cost you trust and opportunities.", consequence: "You get benched for a week and regret giving in." },
      { text: "Explain that you’ve made a commitment to your team", points: 10, feedback: "Solid! Keeping your word shows discipline and leadership.", consequence: "Your friend respects your decision — eventually." },
      { text: "Pretend to be sick so you can hang out", points: 4, feedback: "Dishonesty might help short term, but it’ll bite you later.", consequence: "You feel anxious when your coach asks for a doctor’s note." }
    ]
  },
  {
    id: 5,
    situation: "Someone in your class asks to copy your test answers because they ‘really need to pass.’",
    choices: [
      { text: "Let them — you’re just helping a friend", points: 0, feedback: "Cheating helps no one. It risks both your grades and integrity.", consequence: "You both get caught and lose your teacher’s trust." },
      { text: "Say no and offer to study together next time", points: 10, feedback: "That’s real support — you helped without risking your integrity.", consequence: "They agree to study and thank you later." },
      { text: "Ignore them and hope the teacher doesn’t see", points: 3, feedback: "Avoiding the issue might save the moment, but it doesn’t help long term.", consequence: "You feel guilty for not standing up for what’s right." }
    ]
  },
  {
    id: 6,
    situation: "A friend offers you a vape in the school parking lot, saying ‘it’s just fruit flavor, not a big deal.’",
    choices: [
      { text: "Try it once — it can’t hurt", points: 0, feedback: "Even one hit can start a habit. Your lungs will thank you for skipping it.", consequence: "You cough hard and regret giving in." },
      { text: "Say no thanks and change the subject", points: 10, feedback: "Perfect! Calm confidence works best.", consequence: "They drop it and you move on with no stress." },
      { text: "Laugh it off but take it anyway", points: 2, feedback: "Joking doesn’t erase the risk — your health isn’t a punchline.", consequence: "You feel pressure to keep doing it next time too." }
    ]
  },
  {
    id: 7,
    situation: "A group dares you to post an embarrassing video for laughs, promising it’ll ‘go viral.’",
    choices: [
      { text: "Do it — it’s harmless fun", points: 0, feedback: "Once it’s online, you can’t take it back. Viral regret is real.", consequence: "You get unwanted attention and wish you hadn’t posted it." },
      { text: "Refuse and make a joke to change the subject", points: 10, feedback: "Great move — humor can defuse pressure fast.", consequence: "They laugh it off and move on, no harm done." },
      { text: "Walk away annoyed", points: 5, feedback: "That works too, though staying calm could help you keep control.", consequence: "You avoid trouble but feel left out." }
    ]
  },
  {
    id: 8,
    situation: "A friend says they can sneak you into a concert without paying — everyone’s doing it.",
    choices: [
      { text: "Go along — it’s just one time", points: 0, feedback: "Small risks can lead to big consequences. It’s not worth it.", consequence: "You get caught at the gate and feel embarrassed." },
      { text: "Offer to help buy tickets instead", points: 10, feedback: "Smart! You found a win-win solution that avoids risk.", consequence: "You both enjoy the show the right way." },
      { text: "Say no and make up an excuse", points: 5, feedback: "That works, but honesty can build more respect.", consequence: "They tease you a bit, but you feel better later." }
    ]
  },
  {
    id: 9,
    situation: "You’re at a small party where people start drinking from an unmarked bottle. Someone passes it to you.",
    choices: [
      { text: "Take a small sip so no one judges you", points: 0, feedback: "Safety first — you never know what’s really in it.", consequence: "You feel dizzy and worried afterward." },
      { text: "Say no thanks and grab some water", points: 10, feedback: "Nice! You stayed confident and safe.", consequence: "Someone else follows your lead and skips it too." },
      { text: "Pretend to drink it and put it down", points: 7, feedback: "That’s clever in the moment, though honesty is stronger long term.", consequence: "You avoid risk but feel nervous someone might notice." }
    ]
  },
  {
    id: 10,
    situation: "You’re feeling stressed about grades and a friend says, ‘just take one of my study pills — it’ll help you focus.’",
    choices: [
      { text: "Take one, it’s not like it’s illegal", points: 0, feedback: "Prescription meds can be dangerous if they’re not yours.", consequence: "You feel jittery and regret it later." },
      { text: "Say no thanks, you’ll handle it your own way", points: 10, feedback: "That’s maturity — your health comes first.", consequence: "You push through and feel proud of yourself later." },
      { text: "Say maybe next time to avoid arguing", points: 3, feedback: "Avoiding conflict helps short term, but firm boundaries matter.", consequence: "They bring it up again later expecting you’ll say yes." }
    ]
  }
]


  const handleChoice = (choiceIndex) => {
    setSelectedChoice(choiceIndex)
    setShowFeedback(true)
    const points = scenarios[currentScenario].choices[choiceIndex].points
    setScore(prev => prev + points)
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
    } else {
      setGameComplete(true)
      onComplete('decision-game', score)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setGameComplete(false)
    setSelectedChoice(null)
    setShowFeedback(false)
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-lg text-gray-600 mb-4">Your Score: {score}/{scenarios.length * 10}</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Key Takeaways:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Healthy decision-making involves considering long-term consequences</li>
              <li>• Supporting friends means guiding them toward professional help when needed</li>
              <li>• Authentic relationships are built on mutual respect and shared values</li>
              <li>• It's okay to remove yourself from uncomfortable situations</li>
            </ul>
          </div>
          <button 
            onClick={resetGame}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentScenario]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Scenario {currentScenario + 1} of {scenarios.length}</span>
          <span className="text-sm text-blue-600 font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Situation:</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{scenario.situation}</p>
      </div>

      {!showFeedback ? (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">What would you do?</h4>
          <div className="space-y-3">
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-lg mb-4 ${selectedChoice !== null && scenario.choices[selectedChoice].points >= 7 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h4 className="font-medium mb-2">
              {selectedChoice !== null && scenario.choices[selectedChoice].points >= 7 ? 'Great Choice!' : 'Think About This:'}
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              {selectedChoice !== null && scenario.choices[selectedChoice].feedback}
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-600">
                <strong>What happens next:</strong> {selectedChoice !== null && scenario.choices[selectedChoice].consequence}
              </p>
            </div>
          </div>
          <button
            onClick={nextScenario}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>{currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Game'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Peer Pressure Game components
function PeerPressureGame({ onComplete }) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [responses, setResponses] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

const pressureScenarios = [
    {
      pressure: "Come on, everyone's doing it. Don't be such a baby.",
      effectiveResponses: [
        "I'm comfortable with my decision.",
        "I don't need to prove anything to anyone.",
        "I'm good, thanks."
      ],
      ineffectiveResponses: [
        "Maybe you're right...",
        "I guess I am being a baby.",
        "Fine, I'll do it."
      ],
      tip: "Confident, brief responses work best. Don't over-explain or justify your decisions."
    },
    {
      pressure: "You're missing out on all the fun. Live a little!",
      effectiveResponses: [
        "I have fun in other ways.",
        "This isn't my idea of fun.",
        "I'm already living my best life."
      ],
      ineffectiveResponses: [
        "You're probably right about missing out.",
        "Maybe I should live a little more.",
        "I don't want to miss the fun."
      ],
      tip: "Redefine 'fun' and 'living' on your own terms. Your version of a good time is valid."
    },
    {
      pressure: "If you don't try it, how do you know you won't like it?",
      effectiveResponses: [
        "I don't need to try everything to know what's right for me.",
        "I already know this isn't for me.",
        "Some risks aren't worth taking."
      ],
      ineffectiveResponses: [
        "I guess I'll never know unless I try.",
        "You make a good point.",
        "Maybe I should be more open-minded."
      ],
      tip: "You don't have to experience everything to make informed decisions. Trust your judgment."
    },
    {
      pressure: "We won't tell anyone. It'll just be between us.",
      effectiveResponses: [
        "It's not about who knows, it's about what's right for me.",
        "I'm not interested, but thanks anyway.",
        "Nah, I'm all set."
      ],
      ineffectiveResponses: [
        "Well, if no one will find out...",
        "I guess it would be okay if it's just us.",
        "Okay, but you have to promise not to tell."
      ],
      tip: "Privacy doesn't change what's healthy or safe for you. Make decisions based on your values, not secrecy."
    },
    {
      pressure: "I thought we were friends. Friends do this stuff together.",
      effectiveResponses: [
        "Real friends respect my boundaries.",
        "Being friends doesn't mean we have to do everything together.",
        "I value our friendship, but this isn't for me."
      ],
      ineffectiveResponses: [
        "I don't want to lose you as a friend...",
        "Maybe I should just go along with it.",
        "Fine, if that's what friends do."
      ],
      tip: "Friendship shouldn't be conditional. True friends respect your choices without manipulation."
    },
    {
      pressure: "You're being so uptight. Just relax and try it once.",
      effectiveResponses: [
        "I'm perfectly relaxed as I am.",
        "This is me relaxed—I don't need that.",
        "I relax in my own way."
      ],
      ineffectiveResponses: [
        "Maybe I am being too uptight...",
        "I guess one time won't hurt.",
        "You think I need to loosen up?"
      ],
      tip: "Saying no doesn't mean you're uptight—it means you're making a choice. Stay calm and confident."
    },
    {
      pressure: "Don't you trust me? I wouldn't let anything bad happen to you.",
      effectiveResponses: [
        "Trust isn't the issue—I just don't want to.",
        "I trust you, but I still make my own choices.",
        "I appreciate that, but my answer is still no."
      ],
      ineffectiveResponses: [
        "I do trust you... maybe it's okay.",
        "I don't want you to think I don't trust you.",
        "Okay, I trust you."
      ],
      tip: "Trust is important, but it doesn't override your personal boundaries. You can trust someone and still say no."
    },
    {
      pressure: "It's not even a big deal. Why are you making such a fuss?",
      effectiveResponses: [
        "It's a big deal to me, and that's what matters.",
        "I'm not making a fuss—I'm just saying no.",
        "Whether it's a big deal or not, I'm not interested."
      ],
      ineffectiveResponses: [
        "Maybe I am overreacting...",
        "I don't want to seem dramatic.",
        "Okay, fine, I'll stop making it a big deal."
      ],
      tip: "You get to decide what's important to you. Don't let others minimize your concerns."
    },
    {
      pressure: "After all I've done for you, you can't do this one thing for me?",
      effectiveResponses: [
        "I appreciate what you've done, but that doesn't change my decision.",
        "This isn't something I can do, even as a favor.",
        "I value what you do for me, but this crosses a line for me."
      ],
      ineffectiveResponses: [
        "You're right, I do owe you...",
        "I feel bad now... maybe I should.",
        "Okay, since you put it that way."
      ],
      tip: "Guilt trips are manipulation. Healthy relationships don't keep score or trade favors for compromising your values."
    }
  ]

const handleResponse = (responseIndex, isEffective) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    const newResponse = {
      level: currentLevel,
      response: isEffective ? pressureScenarios[currentLevel].effectiveResponses[responseIndex] : pressureScenarios[currentLevel].ineffectiveResponses[responseIndex],
      effective: isEffective,
      points: isEffective ? 10 : 2
    }
    
    const newResponses = [...responses, newResponse]
    const newScore = score + newResponse.points
    
    setResponses(newResponses)
    setScore(newScore)

    if (currentLevel < pressureScenarios.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1)
        setIsProcessing(false)
      }, 2000)
    } else {
      setTimeout(() => {
        setGameComplete(true)
        setIsProcessing(false)
        onComplete('peer-pressure', newScore)
      }, 2000)
    }
  }

const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setGameComplete(false)
    setResponses([])
    setIsProcessing(false)
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resistance Training Complete!</h2>
          <p className="text-lg text-gray-600">Your Score: {score}/{pressureScenarios.length * 10}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-purple-900 mb-3">Your Responses:</h3>
          {responses.map((response, index) => (
            <div key={index} className={`p-2 mb-2 rounded ${response.effective ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm">"{response.response}"</span>
                <span className="text-xs font-medium">{response.points} pts</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Key Strategies:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep responses short and confident</li>
            <li>• Don't over-explain or justify your decisions</li>
            <li>• Redefine concepts like "fun" on your own terms</li>
            <li>• Trust your judgment - you don't need to try everything</li>
          </ul>
        </div>

        <button 
          onClick={resetGame}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Practice Again</span>
        </button>
      </div>
    )
  }

  const currentScenario = pressureScenarios[currentLevel]
  const allResponses = [...currentScenario.effectiveResponses, ...currentScenario.ineffectiveResponses].sort(() => Math.random() - 0.5)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Level {currentLevel + 1} of {pressureScenarios.length}</span>
          <span className="text-sm text-purple-600 font-medium">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentLevel + 1) / pressureScenarios.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-red-900 mb-2">Peer Pressure:</h3>
          <p className="text-red-800">"{currentScenario.pressure}"</p>
        </div>
        <p className="text-gray-600 text-sm mb-4">Choose the most effective response:</p>
      </div>

<div className="space-y-3 mb-4">
        {allResponses.map((response, index) => {
          const isEffective = currentScenario.effectiveResponses.includes(response)
          const effectiveIndex = currentScenario.effectiveResponses.indexOf(response)
          const ineffectiveIndex = currentScenario.ineffectiveResponses.indexOf(response)
          
          return (
            <button
              key={index}
              onClick={() => handleResponse(
                isEffective ? effectiveIndex : ineffectiveIndex, 
                isEffective
              )}
              disabled={isProcessing}
              className={`w-full text-left p-4 border-2 border-gray-200 rounded-lg transition-colors ${
                isProcessing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              "{response}"
            </button>
          )
        })}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Strategy tip:</strong> {currentScenario.tip}
        </p>
      </div>
    </div>
  )
}

// Wellness Tracker Game components
function WellnessTracker({ onComplete }) {
  const [currentDate] = useState(new Date().toISOString().split('T')[0])
  const [wellnessData, setWellnessData] = useState({
    mood: 5,
    sleep: 7,
    stress: 5,
    physical: 5,
    social: 5,
    notes: ''
  })
  const [weekData, setWeekData] = useState([])
  const [showStats, setShowStats] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [streak, setStreak] = useState(0)
  const [hasEnteredToday, setHasEnteredToday] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState('mood')

  const moodEmojis = ['😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳']
  const categories = [
    { key: 'mood', label: 'Mood', icon: '😊', color: 'yellow', gradient: 'from-yellow-300 to-yellow-500', max: 10 },
    { key: 'sleep', label: 'Sleep Hours', icon: '😴', color: 'blue', gradient: 'from-blue-300 to-blue-500', max: 12 },
    { key: 'stress', label: 'Stress Level', icon: '😰', color: 'red', gradient: 'from-red-300 to-red-500', max: 10 },
    { key: 'physical', label: 'Physical Activity', icon: '🏃', color: 'green', gradient: 'from-green-300 to-green-500', max: 10 },
    { key: 'social', label: 'Social Connection', icon: '👥', color: 'purple', gradient: 'from-purple-300 to-purple-500', max: 10 }
  ]

  const initializeEmptyWeek = () => {
    const emptyWeek = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      emptyWeek.push({
        date: date.toISOString().split('T')[0],
        mood: null,
        sleep: null,
        stress: null,
        physical: null,
        social: null,
        notes: ''
      })
    }
    return emptyWeek
  }

// data loader (on mount)  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window.storage === 'undefined') {
          console.log('Storage API not available, using session state only')
          setWeekData(initializeEmptyWeek())
          setIsLoading(false)
          return
        }

        const savedWeekData = await window.storage.get('wellness-week-data')
        const savedStreak = await window.storage.get('wellness-streak')
        const savedAchievements = await window.storage.get('wellness-achievements')
        
        if (savedWeekData && savedWeekData.value) {
          const parsedData = JSON.parse(savedWeekData.value)
          setWeekData(parsedData)
          
          const todayEntry = parsedData.find(entry => entry.date === currentDate)
          if (todayEntry) {
            setHasEnteredToday(true)
            setWellnessData(todayEntry)
          }
        } else {
          setWeekData(initializeEmptyWeek())
        }
        
        if (savedStreak && savedStreak.value) {
          setStreak(parseInt(savedStreak.value))
        }
        
        if (savedAchievements && savedAchievements.value) {
          setAchievements(JSON.parse(savedAchievements.value))
        }
      } catch (error) {
        console.log('Error loading data, starting fresh:', error)
        setWeekData(initializeEmptyWeek())
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [currentDate])

  const handleSliderChange = (key, value) => {
    setWellnessData(prev => ({ ...prev, [key]: parseInt(value) }))
  }

  const handleSubmit = async () => {
    const newEntry = {
      date: currentDate,
      ...wellnessData
    }
    
    const filteredWeek = weekData.filter(d => d.date !== currentDate)
    const updatedWeek = [...filteredWeek, newEntry]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7)
    
    setWeekData(updatedWeek)
    
    let newStreak = hasEnteredToday ? streak : streak + 1
    setStreak(newStreak)
    setHasEnteredToday(true)
    
    const newAchievements = []
    if (newStreak === 3 && !achievements.includes('3-Day Streak! 🔥')) {
      newAchievements.push('3-Day Streak! 🔥')
    }
    if (newStreak === 7 && !achievements.includes('Week Warrior! 🏆')) {
      newAchievements.push('Week Warrior! 🏆')
    }
    if (wellnessData.mood >= 8) newAchievements.push('Positive Vibes! ✨')
    if (wellnessData.sleep >= 8) newAchievements.push('Well Rested! 💤')
    if (wellnessData.physical >= 7) newAchievements.push('Active Lifestyle! 💪')
    
    const allAchievements = [...achievements, ...newAchievements]
    if (newAchievements.length > 0) {
      setAchievements(allAchievements)
    }
    
    try {
      if (typeof window.storage !== 'undefined') {
        await window.storage.set('wellness-week-data', JSON.stringify(updatedWeek))
        await window.storage.set('wellness-streak', newStreak.toString())
        await window.storage.set('wellness-achievements', JSON.stringify(allAchievements))
      }
    } catch (error) {
      console.log('Could not save to storage:', error)
    }
    
    const totalScore = Object.values(wellnessData)
      .filter(v => typeof v === 'number')
      .reduce((sum, val) => sum + val, 0)
    
    onComplete('wellness-tracker', totalScore)
    setShowStats(true)
  }

  const getAverage = (key) => {
    const validEntries = weekData.filter(day => day[key] !== null && day[key] !== undefined)
    if (validEntries.length === 0) return '0.0'
    const sum = validEntries.reduce((acc, day) => acc + day[key], 0)
    return (sum / validEntries.length).toFixed(1)
  }

  const getTrend = (key) => {
    const validEntries = weekData.filter(day => day[key] !== null && day[key] !== undefined)
    if (validEntries.length < 2) return 'neutral'
    
    const halfPoint = Math.floor(validEntries.length / 2)
    const recent = validEntries.slice(halfPoint)
    const older = validEntries.slice(0, halfPoint)
    
    if (recent.length === 0 || older.length === 0) return 'neutral'
    
    const recentAvg = recent.reduce((acc, day) => acc + day[key], 0) / recent.length
    const olderAvg = older.reduce((acc, day) => acc + day[key], 0) / older.length
    
    if (recentAvg > olderAvg + 0.5) return 'up'
    if (recentAvg < olderAvg - 0.5) return 'down'
    return 'neutral'
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your wellness data...</p>
        </div>
      </div>
    )
  }

  if (showStats) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Entry Recorded! 🎉</h2>
          <p className="text-lg text-gray-600">Streak: {streak} {streak === 1 ? 'day' : 'days'}</p>
        </div>

        {achievements.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">Achievements! 🏆</h3>
            <div className="space-y-1">
              {achievements.slice(-3).map((achievement, index) => (
                <div key={index} className="text-sm text-yellow-800">
                  ✨ {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-900 mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <div key={cat.key} className="bg-white p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{cat.label}</span>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {wellnessData[cat.key]}/{cat.max}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowStats(false)}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  const selectedCategory = categories.find(c => c.key === selectedMetric)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Wellness Check-In</h2>
            <p className="text-sm text-gray-500">
              {new Date(currentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-green-800">Streak: {streak} 🔥</span>
          </div>
        </div>
        
        {hasEnteredToday && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800">✅ You can update your entry for today</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl mb-6 shadow-inner">
        <h3 className="font-semibold text-gray-900 mb-4">7-Day Wellness Trends</h3>
        
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedMetric(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative overflow-hidden ${
                selectedMetric === cat.key
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={selectedMetric === cat.key}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 relative">
          <div className="flex items-end justify-between h-48 space-x-2">
            {weekData.map((day, index) => {
              const isToday = day.date === currentDate
              const value = day[selectedMetric]
              const hasData = value !== null && value !== undefined
              const max = selectedCategory.max
              const heightPercentage = hasData ? (value / max) * 100 : 0
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  {hasData && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {value}/{max}
                    </div>
                  )}
                  
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden ${
                      isToday ? 'ring-2 ring-offset-2 ring-blue-400' : ''
                    }`}
                    style={{ 
                      height: `${heightPercentage}%`,
                      minHeight: hasData ? '8px' : '2px'
                    }}
                  >
                    {hasData ? (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-t ${selectedCategory.gradient} animate-pulse`} />
                        <div className={`absolute inset-0 bg-gradient-to-t ${selectedCategory.gradient} opacity-70`} />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm font-bold mt-1 ${hasData ? 'text-gray-900' : 'text-gray-400'}`}>
                      {hasData ? value : '-'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute w-full border-t border-gray-200"
                style={{ bottom: `${percent}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">Average</div>
            <div className="text-lg font-bold text-gray-900">{getAverage(selectedMetric)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">Trend</div>
            <div className="text-lg font-bold flex items-center justify-center">
              {getTrend(selectedMetric) === 'up' && <span className="text-green-600">↑ Rising</span>}
              {getTrend(selectedMetric) === 'down' && <span className="text-red-600">↓ Falling</span>}
              {getTrend(selectedMetric) === 'neutral' && <span className="text-gray-600">→ Stable</span>}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">Days Logged</div>
            <div className="text-lg font-bold text-gray-900">
              {weekData.filter(d => d[selectedMetric] !== null).length}/7
            </div>
          </div>
        </div>
      </div>

      {/* sliders */}
      <div className="space-y-6 mb-6">
        {categories.map(cat => {
          const trend = getTrend(cat.key)
          const average = getAverage(cat.key)
          const percentage = (wellnessData[cat.key] / cat.max) * 100
          
          return (
            <div key={cat.key} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <span className="font-semibold text-gray-900 block">{cat.label}</span>
                    <span className="text-xs text-gray-500">7-day avg: {average}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {trend === 'down' && <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {cat.key === 'mood' ? moodEmojis[wellnessData[cat.key] - 1] : wellnessData[cat.key]}
                    </div>
                    <div className="text-xs text-gray-500">/{cat.max}</div>
                  </div>
                </div>
              </div>
              
              {/* progress bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${cat.gradient} transition-all duration-300 ease-out rounded-full`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                </div>

                <input
                  type="range"
                  min="1"
                  max={cat.max}
                  value={wellnessData[cat.key]}
                  onChange={(e) => handleSliderChange(cat.key, e.target.value)}
                  className="absolute left-0 right-0 w-full appearance-none cursor-pointer opacity-0 z-20"
                  style={{ top: '-8px', bottom: '-8px' }}
                />
              </div>

              {/* warning messages */}
              {cat.key === 'stress' && wellnessData.stress > 7 && (
                <p className="text-xs text-red-600 mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  High stress detected. Consider relaxation techniques.
                </p>
              )}
              {cat.key === 'sleep' && wellnessData.sleep < 6 && (
                <p className="text-xs text-orange-600 mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  Low sleep can impact wellbeing. Aim for 7-9 hours.
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* notes */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">
          📝 Notes (Optional)
        </label>
        <textarea
          value={wellnessData.notes}
          onChange={(e) => setWellnessData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="How are you feeling today? Any thoughts or reflections..."
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          rows="3"
        />
      </div>

      {/* quick insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl mb-6 border border-purple-100">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Quick Insights
        </h3>
        <div className="space-y-2 text-sm text-purple-800">
          {wellnessData.mood >= 7 && wellnessData.physical >= 6 && (
            <p className="flex items-start"><span className="mr-2">•</span><span>Great combo! Physical activity and positive mood go hand in hand. 💪</span></p>
          )}
          {wellnessData.social >= 7 && (
            <p className="flex items-start"><span className="mr-2">•</span><span>Strong social connections support wellbeing. 🤝</span></p>
          )}
          {wellnessData.stress > 6 && wellnessData.sleep < 7 && (
            <p className="flex items-start"><span className="mr-2">•</span><span>High stress + low sleep is tough. Prioritize rest tonight. 😴</span></p>
          )}
          {Object.values(wellnessData).filter(v => typeof v === 'number' && v >= 7).length >= 4 && (
            <p className="flex items-start"><span className="mr-2">•</span><span>You're doing great across multiple areas! Keep up the amazing work! ⭐</span></p>
          )}
        </div>
      </div>

      {/* submit btn */}
      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Save Today's Entry</span>
      </button>
    </div>
  )
}

// Progress Dashboard
function ProgressDashboard({ userProgress }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Games Completed</p>
            <p className="text-2xl font-bold text-blue-600">{userProgress.gamesCompleted}</p>
          </div>
          <Gamepad2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-green-600">{userProgress.totalScore}</p>
          </div>
          <Star className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-purple-600">{userProgress.currentStreak}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  )
}

//Header (includes buttons to all parts of the website, home, play games, learn, about, get help.)
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'games', label: 'Play Games', icon: Gamepad2, path: '/games' },
    { id: 'learn', label: 'Learn', icon: BookOpen, path: '/learn' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
    { id: 'help', label: 'Get Help', icon: HelpCircle, path: '/help' }
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={logo} alt="SoberSteps logo" className="w-10 h-10 mr-3" />
            <span className="text-2xl font-bold text-gray-900">SoberSteps</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {React.createElement(item.icon, { className: 'w-4 h-4' })}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium text-gray-700"
              >
                {React.createElement(item.icon, { className: 'w-4 h-4' })}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

//Games Page containing all games
function GamesPage({ userProgress, updateProgress }) {
  const [currentGame, setCurrentGame] = useState(null)

  const handleGameComplete = (gameId, score) => {
    updateProgress(gameId, score, true)
    setTimeout(() => setCurrentGame(null), 3000) //note for aditeya: this line is a 3 second timer to return to games page (might edit to 5)
  }

  if (currentGame === 'decision-simulator') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentGame(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Games</span>
          </button>
          <DecisionGame onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  if (currentGame === 'peer-pressure-challenge') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentGame(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Games</span>
          </button>
          <PeerPressureGame onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  if (currentGame === 'wellness-tracker') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentGame(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>Back to Games</span>
          </button>
          <WellnessTracker onComplete={handleGameComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Learning Games</h1>
          <p className="text-xl text-gray-600">Practice real-world skills in a safe environment</p>
        </div>
        
        <ProgressDashboard userProgress={userProgress} />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
              <Target className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Decision Simulator</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Navigate realistic peer pressure scenarios and learn effective decision-making strategies.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: Beginner</span>
                <span>Duration: 10-15 min</span>
              </div>
              <button 
                onClick={() => setCurrentGame('decision-simulator')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-xl">
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Peer Pressure Challenge</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Practice responding to peer pressure with confidence and develop resistance skills.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: Intermediate</span>
                <span>Duration: 8-12 min</span>
              </div>
              <button 
                onClick={() => setCurrentGame('peer-pressure-challenge')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Start Challenge
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-t-xl">
              <Heart className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white">Wellness Tracker</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Build healthy habits and track your mental and physical wellbeing journey.</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Difficulty: All Levels</span>
                <span>Duration: Daily</span>
              </div>
              <button 
                onClick={() => setCurrentGame('wellness-tracker')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Home Page
function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="perspective-wrap">
      <div className="enter-perspective bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Play. Learn.
              <br />
              <span className="text-indigo-600">
                Stay Strong.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Interactive and educational games that are designed to build awareness, develop life skills, 
              and support healthy decision-making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/games')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Playing</span>
              </button>
              <button 
                onClick={() => navigate('/learn')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Learning Games</h2>
            <p className="text-xl text-gray-600">Practice real-world scenarios in a safe environment</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Decision Simulator</h3>
              <p className="text-gray-600 mb-6">
                Through realistic peer pressure scenarios, with immediate feedback, learn how to go through peer pressure. Based on principles based on 
                cognitive and behavioral principles, this game helps you practice decision making skills.
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Realistic peer pressure scenarios</li>
                <li>• Immediate consequences and feedback</li>
                <li>• Evidence-based resistance strategies</li>
                <li>• Skills transfer to real-world situations</li>
              </ul>
              <button 
                onClick={() => navigate('/games')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try It Now
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Scenarios</h4>
                  <p className="text-sm text-gray-600">Practice makes perfect. Build confidence through repetition.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Interactive Learning Works</h2>
            <p className="text-xl text-gray-600">Backed by educational research and prevention science</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Smile className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">90% Better Retention</h3>
              <p className="text-gray-600 leading-relaxed">
                Through these interactive and educational games, knowledge retention increases to 90%, compared to passive instruction, according to 
                numerous research studies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Transfer</h3>
              <p className="text-gray-600 leading-relaxed">
                Scenario based learning helps students apply skills in real situations, 
                connecting the gap between knowledge and action.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Self-Efficacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice builds confidence. Students who engage with interactive scenarios like these are more likely to
                report higher self-confidence and success in challenging situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

//Learn Page (Links to all articles, credits are in README.md)
function LearnPage() {
  const topics = [
    {
      id: 'peer-pressure',
      title: 'Understanding Peer Pressure',
      summary: 'This article on General psychology goes over types of peer pressure and coping methods. Learn about different types of peer pressure and evidence-based resistance strategies.',
      readTime: '8 min read',
      externalLink: 'https://www.verywellmind.com/what-is-peer-pressure-22246'
    },
    {
      id: 'peer-pressure-positive',
      title: 'Can Peer Pressure Help Teens Make Safer Decisions?',
      summary: 'This article goes into a deep view of research, explaning how positive peer influence can be protective. Exploring the positive side of peer influence and how it can support healthy choices.',
      readTime: '6 min read',
      externalLink: 'https://www.sciencejournalforkids.org/articles/can-peer-pressure-help-teens-make-safer-decisions/'
    },
    {
      id: 'decision-making',
      title: 'Evidence-Based Decision-Making Framework',
      summary: 'This scientific paper outlines structured decision-making frameworks. A step-by-step approach to making decisions that align with your values and goals.',
      readTime: '10 min read',
      externalLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8961960/'
    },
    {
      id: 'stress-management',
      title: 'Stress Management Techniques',
      summary: 'This highly informational medical overview of evidence-based stress management techniques. Learn healthy ways to manage stress and difficult emotions without harmful substances.',
      readTime: '12 min read',
      externalLink: 'https://www.ncbi.nlm.nih.gov/books/NBK513300/'
    },
    {
      id: 'stress-reduction',
      title: 'Top Ways to Reduce Daily Stress',
      summary: 'This article goes over practical guidance on long-term stress reduction and resilience. Evidence-based techniques from Harvard Health for managing everyday stressors.',
      readTime: '10 min read',
      externalLink: 'https://www.health.harvard.edu/staying-healthy/top-ways-to-reduce-daily-stress'
    },
    {
      id: 'who-guide',
      title: 'Guide for Evidence-Informed Decision-Making',
      summary: 'This article is a global framework for decision-making under uncertainty and pressure. Comprehensive guidance on making informed choices in challenging situations.',
      readTime: '14 min read',
      externalLink: 'https://www.who.int/publications/i/item/9789240039872'
    }
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Learning Resources</h1>
          <p className="text-xl text-gray-600">Research-backed information to support healthy decision-making</p>
        </div>
        
        <div className="space-y-6">
          {topics.map((topic) => (
            <div 
              key={topic.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{topic.title}</h3>
                <span className="text-sm text-gray-500">{topic.readTime}</span>
              </div>
              <p className="text-gray-600 mb-4">{topic.summary}</p>
              <a 
                href={topic.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <span className="text-sm">Read Full Article</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Need Additional Support?</h2>
          <p className="text-blue-800 mb-4">
            If you're struggling with these topics or need someone to talk to, remember that seeking help is a sign of strength.
          </p>
          <a 
            href="/help"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Support Resources
          </a>
        </div>
      </div>
    </div>
  )
}


// About Page
function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SoberSteps</h1>
          <p className="text-xl text-gray-600">Evidence-based prevention education through interactive learning</p>
        </div>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-gray-700 mb-6">
            SoberSteps combines educational research, prevention science, and interactive technology 
            to help young people develop critical life skills and make informed decisions about their health and wellbeing.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Evidence-Based Approach</h2>
          <p className="text-gray-700 mb-6">
            Our content is grounded in peer-reviewed research from fields including developmental psychology, 
            prevention science, and educational technology. We partner with researchers and educators to ensure 
            our games and resources reflect current best practices in prevention education.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Research Foundations</h2>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Social Learning Theory (Bandura, 1977)</li>
            <li>• Cognitive-Behavioral Prevention Models</li>
            <li>• Experiential Learning Theory (Kolb, 1984)</li>
            <li>• Self-Determination Theory (Deci & Ryan, 1985)</li>
            <li>• Risk and Protective Factors Framework</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Interactive scenario-based learning with immediate feedback</li>
            <li>• Skills practice through gamified experiences</li>
            <li>• Progress tracking and achievement systems</li>
            <li>• Age-appropriate content based on developmental research</li>
            <li>• Integration with crisis support resources</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Help & Support</h1>
          <p className="text-xl text-gray-600">Professional resources and crisis support</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4">Crisis Support</h3>
            <p className="text-red-800 mb-4">
              If you or someone you know is in immediate danger or crisis, please reach out:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">National Suicide Prevention Lifeline</p>
                <p className="text-red-800">Call or text 988</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">Crisis Text Line</p>
                <p className="text-red-800">Text HOME to 741741</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-900">Emergency Services</p>
                <p className="text-red-800">Call 911</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Substance Abuse Resources</h3>
            <p className="text-blue-800 mb-4">
              Professional support for substance-related concerns:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">SAMHSA National Helpline</p>
                <p className="text-blue-800">1-800-662-HELP (4357)</p>
                <p className="text-xs text-blue-700">Free, confidential, 24/7 treatment referral service</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900">National Suicide Prevention Lifeline</p>
                <p className="text-blue-800">findtreatment.samhsa.gov</p>
                <p className="text-xs text-blue-700">Online treatment locator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">When to Seek Professional Help</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Warning Signs:</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Persistent feelings of sadness or hopelessness</li>
                <li>• Significant changes in behavior or personality</li>
                <li>• Withdrawal from friends, family, or activities</li>
                <li>• Declining academic or work performance</li>
                <li>• Increased risk-taking behaviors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Types of Professional Support:</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• School counselors and social workers</li>
                <li>• Licensed therapists and psychologists</li>
                <li>• Substance abuse counselors</li>
                <li>• Support groups and peer programs</li>
                <li>• Medical professionals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SoberSteps</h3>
            <p className="text-gray-400 text-sm">
              Evidence-based prevention education through interactive learning experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link to="/games" className="block text-gray-400 hover:text-white transition-colors">Interactive Games</Link>
              <Link to="/learn" className="block text-gray-400 hover:text-white transition-colors">Learning Articles</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">Research Citations</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm">
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">Crisis Resources</Link>
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors">Professional Help</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 SoberSteps. All rights reserved. This platform provides educational content only and is not a substitute for professional medical or psychological advice.</p>
        </div>
      </div>
    </footer>
  )
}

// Routing/main app comp
function App() {
  const { userProgress, updateProgress } = useGameState()

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage userProgress={userProgress} updateProgress={updateProgress} />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App